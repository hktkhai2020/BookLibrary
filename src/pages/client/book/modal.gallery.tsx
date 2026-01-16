import { Modal } from "antd";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";

interface ModalGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: ReactImageGalleryItem[];
  currentIndex: number;
}

const ModalGallery: React.FC<ModalGalleryProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 10 }}
      className="gallery-modal"
      styles={{
        body: {
          padding: "10px",
        },
      }}
    >
      <div className="w-full">
        <ImageGallery
          items={images}
          startIndex={currentIndex}
          showPlayButton={false}
          showFullscreenButton={true}
          showBullets={true}
          showThumbnails={true}
          thumbnailPosition="bottom"
        />
      </div>
    </Modal>
  );
};

export default ModalGallery;
