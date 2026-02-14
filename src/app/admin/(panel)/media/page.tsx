'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useFirebaseApp, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Copy, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FirestorePermissionError } from '@/firebase/errors';

interface MediaItem {
    id: string;
    fileName: string;
    imageUrl: string;
    storagePath: string;
    contentType: string;
    size: number;
    uploadDate: {
        seconds: number;
    }
}

export default function MediaPage() {
    const firestore = useFirestore();
    const firebaseApp = useFirebaseApp();
    const { toast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

    const mediaCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'media'), orderBy('uploadDate', 'desc'));
    }, [firestore]);

    const { data: mediaItems, isLoading, error } = useCollection<MediaItem>(mediaCollectionRef);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file || !firebaseApp || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Initialization Error',
                description: 'Firebase services are not ready or no file selected.'
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const storage = getStorage(firebaseApp);
        const storagePath = `images/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                let title = 'Upload Failed';
                let description = 'An unknown error occurred. Please try again.';

                switch (error.code) {
                    case 'storage/unauthorized':
                        description = "Permission Denied: You do not have permission to upload files. Please check your account roles and the storage security rules.";
                        break;
                    case 'storage/canceled':
                        description = "The upload was canceled.";
                        break;
                    case 'storage/retry-limit-exceeded':
                        description = "Network timeout. Please check your internet connection and try again.";
                        break;
                    default:
                        description = `An unknown storage error occurred: ${error.message}`;
                        break;
                }
                
                toast({ variant: 'destructive', title, description });
                setIsUploading(false);
                setUploadProgress(0);
            },
            async () => {
                // Upload completed successfully, now get the download URL
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    toast({ title: 'Upload Complete!', description: 'Now saving metadata...' });

                    const mediaData = {
                        fileName: file.name,
                        imageUrl: downloadURL,
                        storagePath: storagePath,
                        contentType: file.type,
                        size: file.size,
                        uploadDate: serverTimestamp()
                    };
                    const mediaCollection = collection(firestore, 'media');
                    await addDoc(mediaCollection, mediaData);

                    toast({
                        variant: 'default',
                        title: 'Success!',
                        description: `${file.name} is now available in the library.`
                    });
                    setFile(null);
                } catch (e: any) {
                    console.error("Failed to save metadata:", e);
                    const firestoreError = new FirestorePermissionError({
                      operation: 'create',
                      path: 'media',
                      requestResourceData: { fileName: file.name },
                    });
                    errorEmitter.emit('permission-error', firestoreError);
                     toast({
                        variant: 'destructive',
                        title: 'Metadata Save Failed',
                        description: 'The file was uploaded, but saving its information to the database failed. Please check Firestore permissions.'
                    });
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            }
        );
    };

    const handleDelete = async () => {
        if (!itemToDelete || !firebaseApp || !firestore) return;
        
        const { id, storagePath, fileName } = itemToDelete;

        const storage = getStorage(firebaseApp);
        const fileRef = ref(storage, storagePath);
        const docRef = doc(firestore, 'media', id);

        try {
            // First, delete the file from Cloud Storage.
            await deleteObject(fileRef);
            toast({ title: 'File Deleted from Storage', description: 'Now deleting from Firestore.' });

            // Then, delete the document from Firestore.
            await deleteDoc(docRef);
            toast({ title: 'Image Deleted', description: `${fileName} has been completely removed.`});
        } catch(e: any) {
            console.error("Deletion failed:", e);
            let title = "Deletion Failed";
            let description = e.message || 'Could not delete the image.';
            
            if (e.code === 'storage/object-not-found') {
                // If the file is already gone from storage, try to delete the Firestore doc anyway.
                try {
                    await deleteDoc(docRef);
                    toast({ title: 'Image Deleted', description: 'File was already gone from storage, but metadata was removed.'});
                } catch (firestoreError: any) {
                     toast({ variant: 'destructive', title: 'Firestore Deletion Failed', description: firestoreError.message});
                }
            } else {
                 const contextualError = new FirestorePermissionError({
                  operation: 'delete',
                  path: docRef.path
                });
                errorEmitter.emit('permission-error', contextualError);
                toast({ variant: 'destructive', title, description});
            }
        } finally {
            setItemToDelete(null);
        }
    };
    
    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({ title: 'Copied to Clipboard', description: 'Image URL has been copied.' });
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Media Library</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Upload New Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input type="file" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                     {isUploading && (
                        <div className="space-y-2 pt-2">
                            <Progress value={uploadProgress} />
                            <p className="text-sm text-muted-foreground text-center">{Math.round(uploadProgress)}%</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpload} disabled={!file || isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Media</CardTitle>
                    <CardDescription>View and manage all uploaded images.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading && (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {error && <p className="text-destructive">Error loading media: {error.message}</p>}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {mediaItems && mediaItems.length > 0 ? (
                                mediaItems.map(item => (
                                    <Card key={item.id} className="overflow-hidden group">
                                        <div className="relative aspect-square w-full">
                                            <Image src={item.imageUrl} alt={item.fileName} fill className="object-cover" />
                                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(item.imageUrl)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => setItemToDelete(item)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-2 text-xs">
                                            <p className="font-medium truncate">{item.fileName}</p>
                                            <p className="text-muted-foreground">{formatBytes(item.size)}</p>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-muted-foreground">No media found.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the image "{itemToDelete?.fileName}" from storage. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
