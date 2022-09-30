import React, { useState, useEffect } from 'react';

const NotFound = () => {

  const [orientation, setOrientation] = useState(0)
  const [orientationMode, setOrientationMode] = useState('portrait')

  useEffect(() => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      setOrientationMode('portrait')
    }

    if (window.matchMedia("(orientation: landscape)").matches) {
      setOrientationMode('landscape')
    }
  }, [orientation])

  useEffect(() => {
    window.onorientationchange = function (event) {
      setOrientation(event.target.screen.orientation.angle)
    };
  }, [])


  return (
    <div className="row">
      <img
        onClick={() => {
          window.history.back()
        }}
        className="backButtonForMobile"
        alt="Back button"
        src={require('./../assets/img/images/back.png')}
        style={{ display: (orientation === 0 && orientationMode === 'portrait') ? 'block' : 'none', height: 30, width: 30, position: 'absolute', top: '5vw', left: '5vw', zIndex: 999 }} />
      <img alt="404error" src={require('./../assets/img/images/404error.jpeg')} className="img-fluid imagecenter" />
    </div>
  );
}

export default NotFound; 