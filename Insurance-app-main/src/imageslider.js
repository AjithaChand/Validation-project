import React from 'react';
import { Carousel } from "react-bootstrap";
import slide2 from './images/slide2.jpg';
import slide1 from './images/slide1.jpg';
import slide3 from './images/slide3.jpg';
import "./imageslider.css";

const ImageSlider = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img className='d-block' src={slide2} alt="First slide" />
        <Carousel.Caption>
       
        <h4>Elevate your style with our trendy collections and fashion-forward designs.</h4>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block' src={slide1} alt="Second slide" />
        <Carousel.Caption>
         
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block' src={slide3} alt="First slide" />
        <Carousel.Caption>
       
        <h4>Elevate your style with our trendy collections and fashion-forward designs.</h4>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ImageSlider;