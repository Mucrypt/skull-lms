import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { sortOptions, filterOptions } from '@/config';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentContext } from '@/context/student-context';
import { fetchStudentViewCourseListService } from '@/services';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';

function StudentViewCoursesPage() {
  const [sort, setSort] = useState('price-lowtohigh');
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const [originalCoursesList, setOriginalCoursesList] = useState([]);
  const navigate = useNavigate()

  // Handle filter changes
  function handleFilterChange(filterKey, optionId) {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (!updatedFilters[filterKey]) {
        updatedFilters[filterKey] = [];
      }

      if (updatedFilters[filterKey].includes(optionId)) {
        updatedFilters[filterKey] = updatedFilters[filterKey].filter(
          (id) => id !== optionId
        );
      } else {
        updatedFilters[filterKey].push(optionId);
      }

      // Clean up empty filter keys
      Object.keys(updatedFilters).forEach((key) => {
        if (updatedFilters[key].length === 0) {
          delete updatedFilters[key];
        }
      });

      return updatedFilters;
    });
  }

  // Fetch courses from the API
  async function fetchAllStudentViewCourses(filters, sort) {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sortBy: sort,
      });

      const response = await fetchStudentViewCourseListService(queryParams);
      setOriginalCoursesList(response.data);
      setStudentViewCoursesList(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to create query params for filters
  function createSearchParamsHelper(filterParams) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.set(key, value.join(','));
      }
    }
    return queryParams;
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('filters');
    };
  }, []);

  return (
    <div className='container max-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
      <div className='flex flex-col md:flex-row gap-4'>
        <aside className='w-full md:w-64 space-y-4'>
          <div className='space-y-4'>
            {Object.keys(filterOptions).map((filterKey) => (
              <div key={filterKey} className='space-y-4 p-4'>
                <h2 className='font-bold mb-3'>{filterKey.toUpperCase()}</h2>
                <div className='grid gap-2 mt-2'>
                  {filterOptions[filterKey].map((filterItem) => (
                    <Label
                      key={filterItem.id}
                      className='flex font-medium items-center gap-2'
                    >
                      <Checkbox
                        checked={
                          filters[filterKey]?.includes(filterItem.id) || false
                        }
                        onCheckedChange={() => {
                          handleFilterChange(filterKey, filterItem.id);
                        }}
                      />
                      <span>{filterItem.label}</span>
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className='flex-1'>
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Search for courses...'
              className='w-full p-2 border border-gray-300 rounded-md'
              onChange={(e) => {
                const searchQuery = e.target.value.toLowerCase();
                const filteredCourses = originalCoursesList.filter(
                  (course) =>
                    course.title.toLowerCase().includes(searchQuery) ||
                    course.instructorName.toLowerCase().includes(searchQuery)
                );
                setStudentViewCoursesList(filteredCourses);
              }}
            />
          </div>

          <div className='flex justify-end items-center mb-4 gap-5'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='flex items-center gap-2 p-5'>
                  <ArrowUpDownIcon className='w-4 h-4 ml-2' size='sm' />
                  <span className='text-[16px] font-medium'>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className='text-sm font-bold text-black'>{studentViewCoursesList.length} Results</span>
          </div>

          <div className='space-y-4'>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full mt-20">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
              </div>
              <h1 className="mt-4 text-lg font-medium text-gray-800">
                Loading courses, please wait...
              </h1>
            </div>
            
            
            ) : (studentViewCoursesList || []).length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card  className='cursor-pointer'
                 
                 onClick={() => navigate(`/course/details/${courseItem?._id}`)}
                 key={courseItem?._id}>
                  <CardContent className='flex gap-4 p-4'>
                    <div className='w-48 h-32 flex-shrink-0'>
                      <img
                        src={courseItem?.image}
                        className='w-full h-full object-cover'
                        alt={courseItem?.title || 'Course image'}
                      />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='mb-2 text-xl'>
                        {courseItem?.title}
                      </CardTitle>
                      <p className='text-sm text-gray-700 mb-2 font-bold'>
                        Author:{' '}
                        <span className='font-bold'>
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className='text-[18px] text-black mb-2'>
                        {`${courseItem?.curriculum?.length || 0} Lectures - ${
                          courseItem?.totalDuration ||
                          `${courseItem?.totalMinutes || 0} minutes`
                        }`}
                      </p>
                      <p>{courseItem?.level?.toUpperCase()}</p>
                      <p className='font-bold text-lg'>
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center h-full mt-20'>
                <h1 className='text-2xl font-semibold text-gray-800 animate-pulse mb-4'>
                  No Courses Found
                </h1>
                <p className='text-gray-500 text-center max-w-md'>
                  Try adjusting your filters or search criteria to explore other
                  amazing courses available.
                </p>
                <img
                  src='https://via.placeholder.com/150' // Replace with a relevant illustration or image URL
                  alt='No Courses Illustration'
                  className='w-48 h-48 mt-6 opacity-75 hover:opacity-100 transition-opacity duration-300'
                />
                <button
                  onClick={() => window.location.reload()} // Adjust this functionality if needed
                  className='mt-6 px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;