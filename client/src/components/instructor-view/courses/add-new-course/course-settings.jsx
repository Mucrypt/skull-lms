import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import MediaProgressbar from "@/components/media-progress-bar";

function CourseSettings() {
    const {
        courseLandingFormData,
        setCourseLandingFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
    } = useContext(InstructorContext);

    const [uploadError, setUploadError] = useState("");

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    // Handle image upload
    async function handleImageUploadChange(e) {
        const selectedImage = e.target.files[0];

        if (!selectedImage) return;

        if (!selectedImage.type.startsWith("image/")) {
            setUploadError("Invalid file type. Please upload an image.");
            return;
        }

        if (selectedImage.size > MAX_FILE_SIZE) {
            setUploadError("File size exceeds 5 MB. Please upload a smaller image.");
            return;
        }

        const imageFormData = new FormData();
        imageFormData.append("file", selectedImage);

        try {
            setUploadError("");
            setMediaUploadProgress(true);
            const response = await mediaUploadService(
                imageFormData,
                setMediaUploadProgressPercentage
            );

            if (response.success) {
                setCourseLandingFormData({
                    ...courseLandingFormData,
                    image: response.data.url,
                });
            }
        } catch (error) {
            setUploadError("Failed to upload image. Please try again.");
            console.error("Image upload failed:", error);
        } finally {
            setMediaUploadProgress(false);
        }
    }

    function handleRemoveImage() {
        setCourseLandingFormData({
            ...courseLandingFormData,
            image: "",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <div className="p-4">
                {mediaUploadProgress && (
                    <MediaProgressbar
                        isMediaUploading={mediaUploadProgress}
                        mediaProgress={mediaUploadProgressPercentage}
                    />
                )}
            </div>
            <CardContent>
                {courseLandingFormData?.image ? (
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={courseLandingFormData.image}
                            alt="Course"
                            className="w-64 h-64 object-cover rounded-md shadow-md"
                        />
                        <Label htmlFor="image-upload">Change Course Image</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="border border-gray-300 p-2"
                            onChange={handleImageUploadChange}
                        />
                        <Button onClick={handleRemoveImage} className="bg-red-600 text-white mt-4">
                            Remove Image
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="image-upload">Upload Course Image</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="border border-gray-300 p-2"
                            onChange={handleImageUploadChange}
                        />
                    </div>
                )}
                {uploadError && (
                    <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                )}
            </CardContent>
        </Card>
    );
}

export default CourseSettings;
