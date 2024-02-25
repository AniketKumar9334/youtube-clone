import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import VideoItem from "./VideoItem";

const CarouselCompoment = () => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    return (
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="px-1"
        >
            <VideoItem isSmallScreen={true}/>
            <VideoItem isSmallScreen={true}/>
            <VideoItem isSmallScreen={true}/>
            <VideoItem isSmallScreen={true}/>
            <VideoItem isSmallScreen={true}/>
            <VideoItem isSmallScreen={true}/>
        </Carousel>
    );
};

export default CarouselCompoment;
