import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/video-player';
import { StudentContext } from '@/context/student-context';
import { fetchStudentViewCourseDetailsService } from '@/services';
import { CheckCircle, Globe, Lock, PlayCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function StudentViewCourseDetailsPage() {
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
  } = useContext(StudentContext);

  async function fetchStudentViewCourseDetails() {
    try {
      const response = await fetchStudentViewCourseDetailsService(
        currentCourseDetailsId
      );

      if (response?.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        setStudentViewCourseDetails(null);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes('course-details')) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);


  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id]);

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails?.curriculum?.findIndex(
      (item) => item?.freePreview
    ) ?? -1;

  return (
    <div className='mx-auto p-4'>
      <div className='bg-gray-900 text-white p-8 rounded-t-lg'>
        <h1 className='text-3xl font-bold mb-4'>
          {studentViewCourseDetails?.title || 'Loading...'}
        </h1>
        <p className='text-xl mb-4'>{studentViewCourseDetails?.subtitle}</p>

        <div className='flex items-center space-x-4'>
          <span>
            Instructor: {studentViewCourseDetails?.instructorName || 'N/A'}
          </span>
          <span>{studentViewCourseDetails?.date?.split('T')[0] || 'N/A'}</span>
          <span className='flex items-center'>
            <Globe className='mr-1 h-4 w-4' />
            {studentViewCourseDetails?.primaryLanguage || 'N/A'}
          </span>
          <span>
            {studentViewCourseDetails?.students?.length || 0}{' '}
            {studentViewCourseDetails?.students?.length === 1
              ? 'Student'
              : 'Students'}
          </span>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-8 mt-8'>
        <main className='flex-grow'>
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='font-bold text-xl'>
                What you'll learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {studentViewCourseDetails?.objectives
                  ?.split(',')
                  .map((objective, index) => (
                    <li key={index} className='flex items-start space-x-2'>
                      <CheckCircle className='h-5 w-5 mr-2 text-green-500' />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course Description */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='font-bold text-xl'>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 leading-relaxed'>
                {studentViewCourseDetails?.description ||
                  'No description available.'}
              </p>
            </CardContent>
          </Card>

          {/* Course Curriculum */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='font-bold text-xl'>
                Course Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <li
                      key={`${curriculumItem?._id || index}`}
                      className={`${
                        curriculumItem?.freePreview
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed'
                      } flex items-center mb-4`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      {curriculumItem?.freePreview ? (
                        <PlayCircle className='mr-2 h-4 w-4' />
                      ) : (
                        <Lock className='mr-2 h-4 w-4' />
                      )}
                      <span>{curriculumItem?.title}</span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </main>

        <aside className='w-full md:w-[500px]'>
          <Card className='sticky top-4'>
            <CardContent>
              <div className='aspect-video rounded-lg flex items-center justify-center'>
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ]?.videoUrl
                      : ''
                  }
                  width='450px'
                  height='250px'
                />
              </div>

              <div className='mb-4'>
                <span className='text-3xl font-bold'>
                  ${studentViewCourseDetails?.pricing || 'N/A'}
                </span>
              </div>

              <Button className='w-full'>Buy Now</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[800px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
           <div className="flex flex-col gap-2">
           {studentViewCourseDetails?.curriculum
             ?.filter((item) => item.freePreview)
             .map((filteredItem) => (
               <p
                 onClick={() => handleSetFreePreview(filteredItem)}
                 className="cursor-pointer text-[16px] font-medium"
               >
                 {filteredItem?.title}
               </p>
             ))}
         </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default StudentViewCourseDetailsPage;
