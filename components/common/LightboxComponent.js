import React from 'react';
import Lightbox from 'react-images';

class LightboxComponent extends React.Component {
  constructor(props) {
    super();
    this.state = { currentImage: props.currentImageIndex, 
    		annotations: true, 
    		showOriginal: false, 
    		numPages: null,
    	    pageNumber: 1,
    	    showZoom: false,
    	    };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
  }
  
  closeLightbox() {
    this.setState({ currentImage: 0, annotations: false });
    this.props.toggleLightbox();
  }

  gotoPrevious() {
    this.setState({ currentImage: this.state.currentImage - 1 });
  }

  gotoNext() {
    this.setState({ currentImage: this.state.currentImage + 1 });
  }

  gotoImage(index) {
    this.setState({ currentImage: index });
  }

  handleClickImage() {
    if (this.state.currentImage === this.props.images.length - 1) {
      return;
    }
    this.gotoNext();
  }

  toggleAnnotations() {
    this.setState(prevState => ({
      annotations: !prevState.annotations
    }));
  }

  toggleOriginal() {	   
	    this.setState(prevState => ({
	    	showOriginal: !prevState.showOriginal
	      }));
  }
  
  toggleZoomToolbar() {	   
	    this.setState(prevState => ({
	    	showZoom: !prevState.showZoom
	      }));
  }
  
  render() {
	const { currentImage, annotations, showOriginal, pageNumber, numPages, showZoom } = this.state;
    const images = this.props.images.map(img => {
      let src = img.href;
      let srcOrig = img.hrefOriginal;
      let title = img.title;
      if (this.state.annotations && img.hrefAnnotated) {
        src = img.hrefAnnotated;
      }
      if (this.state.showOriginal) {
    	  src = img.hrefOriginal;
    	  title = img.title + ' Original';
      }
      let isPDF = false;
      if (img.hrefThumbnail === 'NoImage') {
    	  src = '';
    	  title = '';
    	  srcOrig = 'https://docs.google.com/viewer?url=' + srcOrig + '&embedded=true';
    	  isPDF = true;
      }
      return {
        src,
        caption: title,
        srcOrig,
        isPDF
      };
    });
    
    const pdfProps = {isPDF: images[this.state.currentImage].isPDF, pdfFile: images[this.state.currentImage].srcOrig};

    let lightboxProps = null;
    if (pdfProps.isPDF) {
    	const divStyle = {
    			position: 'relative',
    			top: '-40vh'
    	};
    	const iframeStyle = {
    			height: '80vh',
    			width: '50vw'
    	};
    	const btnStyle = {
    			position: 'absolute',
    			top: '-2vh',
    			right: '-1vw',
    			fontSize: '1em',
    			color: 'white'
    	};
        lightboxProps = {
        	      currentImage: this.state.currentImage,
        	      images: images,
        	      isOpen: this.props.lightboxIsOpen,
        	      onClickImage: this.handleClickImage,
        	      onClickNext: this.gotoNext,
        	      onClickPrev: this.gotoPrevious,
        	      onClickThumbnail: this.gotoImage,
        	      onClose: this.closeLightbox,
        	      showThumbnails: true,
        	      showImageCount: false,
        	      allowFullscreen: true,
        	      showCloseButton: false,
        	      customControls: [
        	    	  <div id="contentframe" style={divStyle}
        	    	  key = {'parent-div-' + this.state.currentImage} >
        	    	  	<a title="Close" style={btnStyle} onClick={() => {this.closeLightbox();}} >{<i className="glyphicon glyphicon-remove"/>}</a>
        	    	  	<iframe style={iframeStyle}        	    	    	
        	    	    src = {pdfProps.pdfFile} 
        	    	    key = {'child-iframe-' + this.state.currentImage}        	    	    
        	    	  	/>
        	    	  </div>
        	      ]
        	    };
    } else {
        lightboxProps = {
        	      currentImage: this.state.currentImage,
        	      images: images,
        	      isOpen: this.props.lightboxIsOpen,
        	      onClickImage: this.handleClickImage,
        	      onClickNext: this.gotoNext,
        	      onClickPrev: this.gotoPrevious,
        	      onClickThumbnail: this.gotoImage,
        	      onClose: this.closeLightbox,
        	      showThumbnails: true,
        	      allowFullscreen: true,
        	      customControls: [
        	    	  <div key = {'parent-' + this.state.currentImage}>    	  
        	    	  <div key = {'firstChild-' + this.state.currentImage}>
        		    	  {!this.state.showOriginal &&
        		        <button
        		          onClick={() => this.toggleAnnotations()}
        		          key="toggleAnnotations"
        		        >
        		          {this.state.annotations ? 'Hide annotations' : 'Show annotations'}
        		        </button>
        		    	  }        		              
        		      </div>
        		      </div>
        	      ]
        	    };
    }


    return <Lightbox {...lightboxProps} />;
  }
}

export default LightboxComponent;
