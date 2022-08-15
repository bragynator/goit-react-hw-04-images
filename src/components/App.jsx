import { useState, useEffect } from 'react';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreButton } from './LoadMoreButton/LoadMoreButton';
import { Searchbar } from './Searchbar/Searchbar';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PER_PAGE = 12;

export function App() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationPage, setPaginationPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    showModal: false,
    id: null,
  });
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      setShowLoadMoreBtn(false);

      fetch(
        `https://pixabay.com/api/?q=${searchQuery}&page=${String(
          paginationPage
        )}&key=27493415-caff1e79bf6baf64c8d3710ef&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`
      )
        .then(res => res.json())
        .then(data => {
          if (data.hits.length === 0 && paginationPage === 1) {
            toast.error(`Sorry, we didn't find anything!`);
            return;
          }

          setGalleryItems(prev => [...prev, ...data.hits]);

          data.hits.length === PER_PAGE
            ? setShowLoadMoreBtn(true)
            : toast.info(`Oops, it's the end of the collection. Try next.`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchQuery, paginationPage]);

  const handleSubmit = searchQuery => {
    if (searchQuery === '') {
      toast.warn('Please, enter the search query!');
      return;
    }

    setGalleryItems([]);
    setSearchQuery(searchQuery);
    setPaginationPage(1);
  };

  const handleLoadMoreClick = () => setPaginationPage(prev => (prev += 1));

  const showModal = id => setModalInfo({ showModal: true, id });

  const hideModal = () => setModalInfo({ showModal: false, id: null });

  const currentModalItem = galleryItems.find(item => item.id === modalInfo.id);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Searchbar onSubmit={handleSubmit} />
      {galleryItems.length > 0 && (
        <ImageGallery items={galleryItems} showModal={showModal} />
      )}
      {isLoading && <Loader />}
      {showLoadMoreBtn && <LoadMoreButton onClick={handleLoadMoreClick} />}
      {modalInfo.showModal && (
        <Modal item={currentModalItem} onClose={hideModal} />
      )}
    </div>
  );
}
