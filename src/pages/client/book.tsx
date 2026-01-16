import BookDetail from "@/pages/client/book/book.detail";
import { useParams } from "react-router-dom";
const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return id ? <BookDetail /> : <></>;
};
export default BookPage;
