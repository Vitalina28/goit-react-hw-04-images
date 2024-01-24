import { useEffect, useState } from 'react';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';

const PER_PAGE = 12;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleFormSubmit = async searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
  };

  useEffect(() => {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '40708369-d6dc8a1f6c8c52c3bc15ef748';

    if (searchQuery === '') {
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&orientation=horizontal&per_page=${PER_PAGE}&page=${page}`
        );
        setImages(prevImages => [...prevImages, ...response.data.hits]);
      } catch (error) {
        toast.error('Reload the page and try again');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [searchQuery, page]);

  const handleChangePage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleOpenModal = largeImageURL => {
    setSelectedImage(largeImageURL);
  };

  const handleCloseModal = () => {
    setSelectedImage('');
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} onClick={handleOpenModal} />
      )}
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && <Button onClick={handleChangePage} />}
      <Toaster />
      {selectedImage && (
        <Modal onClose={handleCloseModal} selectedImage={selectedImage} />
      )}
    </>
  );
}
