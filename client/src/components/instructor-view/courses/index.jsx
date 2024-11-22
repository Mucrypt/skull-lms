import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InstructorCourses(){
    const navigate = useNavigate()
    return <Card>
        <CardHeader className='flex justify-between flex-row items-center' >
            <CardTitle className='text-3xl font-bold' >All Courses</CardTitle>
            <Button onClick={()=>navigate('/instructor/create-new-course')} className=' px-4 py-2 rounded-md' >Create Course</Button>
        </CardHeader>

        <CardContent>
            <div className="overflow-x-auto" >
            <Table>
  
  <TableHeader>
    <TableRow>
      <TableHead >Course</TableHead>
      <TableHead>Students</TableHead>
      <TableHead>Revenue</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell >Python Full Course</TableCell>
      <TableCell>100</TableCell>
      <TableCell>$3000</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="mr-2">
            <Edit className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" >
            <Delete className="w-5 h-5" />
        </Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>


            </div>
        </CardContent>

    </Card>
}

export default InstructorCourses;