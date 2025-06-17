import Slider from '@/components/Slider';
import AboutUs from '@/components/AboutUs';
import Award from '@/components/Award';
import Teacher from '@/components/teacher';
import NewsEvents from '@/components/NewsEvents';
import Notice from '@/components/Notice';
import StudentResultPage from '@/components/StudentResult';
import GroupedStudentResults from '@/components/GroupedStudentResults'

export default function Home() {
  return (
    <div>
       <StudentResultPage />
       <GroupedStudentResults />
      
    </div>
  );
}
