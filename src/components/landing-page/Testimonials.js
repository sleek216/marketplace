import React, { useRef } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	Avatar,
	IconButton,
	useTheme,
	Button,
	alpha,
	useMediaQuery
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import DollarSignHighlighter from 'components/DollarSignHighlighter';

const testimonialData = [
	{
		id: 1,
		name: "John Smith",
		role: "Customer",
		rating: 5,
		comment: "Amazing service! Fast delivery and great food quality. Highly recommended!",
		avatar: "/images/avatar1.jpg"
	},
	{
		id: 2,
		name: "Sarah Johnson",
		role: "Regular Customer",
		rating: 5,
		comment: "The app is so easy to use and the delivery is always on time. Love it!",
		avatar: "/images/avatar2.jpg"
	},
	{
		id: 3,
		name: "Mike Wilson",
		role: "Food Lover",
		rating: 4,
		comment: "Great variety of restaurants and quick service. Very satisfied!",
		avatar: "/images/avatar3.jpg"
	},
	{
		id: 4,
		name: "Emma Davis",
		role: "Busy Professional",
		rating: 5,
		comment: "Perfect for my busy schedule. Reliable and convenient food delivery.",
		avatar: "/images/avatar4.jpg"
	}
];

const TestimonialCard = ({ testimonial }) => {
	const theme = useTheme();

	return (
		<Card
			className="testimonial-card"
			sx={{
				height: '100%',
				p: { xs: 1, md: 1.2 },
				borderRadius: '4px',
				border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
				boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.06)}`,
				backgroundColor: theme.palette.background.paper,
				minHeight: { xs: 162, md: 174 },
				transform: "scale(0.95)",
				opacity: 0.72,
				transition: "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease",
				"&:hover": {
					transform: "scale(0.96) translateY(-2px)",
					boxShadow: `0 14px 30px ${alpha(theme.palette.common.black, 0.12)}`,
				},
			}}
		>
			<CardContent sx={{ textAlign: 'center', p: "14px !important" }}>
				<Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
					<FormatQuoteOutlinedIcon
						sx={{
							fontSize: 34,
							color: theme.palette.primary.main,
							opacity: 0.75
						}}
					/>
				</Box>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						lineHeight: 1.55,
						mb: 1.4,
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						minHeight: 56,
						fontSize: { xs: "13px", md: "13.5px" },
					}}
				>
					{testimonial.review}
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Avatar
						src={testimonial.reviewer_image_full_url}
						sx={{ width: 46, height: 46, mb: 0.9 }}
					>
						{testimonial.name.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }}>
							{testimonial.name}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '12.5px' }}>
							{testimonial.designation}
						</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

const Testimonials = ({ testimonial_section, handleOrderNow }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const sliderRef = useRef(null);
	const data = testimonial_section?.testimonial_list || testimonialData;

	const handleNext = () => {
		sliderRef.current?.slickNext();
	};

	const handlePrev = () => {
		sliderRef.current?.slickPrev();
	};

	const sliderSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		cssEase: "ease-in-out",
		centerMode: true,
		centerPadding: "0px",
		slidesToShow: 3,
		slidesToScroll: 1,
		swipeToSlide: false,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 4000,
		pauseOnHover: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					centerMode: false,
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: true
				}
			},
			{
				breakpoint: 700,
				settings: {
					centerMode: false,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
			<Grid container spacing={{ xs: 2.5, md: 4 }} alignItems="center">
				{/* Left side - Title and Subtitle */}
				<Grid item xs={12} md={4}>
					<Box sx={{ pr: { md: 3 }, textAlign: { xs: 'center', md: 'left' } }}>
						<Typography
							variant="h3"
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.7rem', md: '2.05rem' },
								mb: 2,
								color: theme.palette.text.primary
							}}
						>
							<DollarSignHighlighter text={testimonial_section?.testimonial_title} theme={theme} />

						</Typography>
						<Typography
							variant="body1"
							sx={{
								color: theme.palette.text.secondary,
								fontSize: { xs: "14px", md: "16px" },
								lineHeight: 1.6,
								maxWidth: { xs: "100%", md: 320 },
								mx: { xs: "auto", md: 0 },
							}}
						>
							{testimonial_section?.testimonial_sub_title}
						</Typography>
						<Button
							onClick={handleOrderNow}
							variant='contained'
							sx={{
								mt: { xs: "12px", md: "1rem" },
								borderRadius: "4px",
								px: 2.2,
								fontWeight: 600,
								textTransform: "none",
							}}
						>
							{testimonial_section?.testimonial_button_title}
						</Button>
					</Box>
				</Grid>

				{/* Right side - React Slick Slider */}
				<Grid item xs={12} md={8}>
					<Box sx={{ position: 'relative' }}>
						{/* Left Navigation Button */}
						<IconButton
							onClick={handlePrev}
							sx={{
								position: 'absolute',
								left: { xs: -8, md: -18 },
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: alpha(theme.palette.background.paper, 0.95),
								color: theme.palette.primary.main,
								border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
								borderRadius: '50%',
								'&:hover': {
									backgroundColor: alpha(theme.palette.primary.main, 0.08),
								},
								width: { xs: 30, md: 34 },
								height: { xs: 30, md: 34 },
								display: { xs: isMobile ? "none" : "inline-flex", md: "inline-flex" },
							}}
						>
							{theme.direction === 'rtl' ? (
								<ArrowForwardIos sx={{ fontSize: "18px" }} />
							) : (
								<ArrowBackIos sx={{ fontSize: "18px", marginLeft: "6px" }} />
							)}
						</IconButton>

						{/* React Slick Slider */}
						<Box
							sx={{
								background: { xs: "transparent", md: alpha(theme.palette.neutral[200], 0.12) },
								paddingTop: "8px",
								pb: "5px",
								borderRadius: "4px",
								border: { md: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` },
								"& .testimonial-slider .slick-list": {
									overflow: "hidden",
									padding: { xs: "4px 0px", md: "8px 10px !important" },
								},
								"& .testimonial-slider .slick-track": {
									display: "flex",
									alignItems: "center",
									paddingBlock: "10px",
								},
								"& .testimonial-slider .slick-slide": {
									px: { xs: "2px", md: "6px" },
								},
								"& .testimonial-slider .slick-slide > div": {
									height: "100%",
								},
								"& .testimonial-slider .slick-center .testimonial-card": {
									transform: "scale(1.01)",
									opacity: 1,
									minHeight: { xs: 190, md: 212 },
									boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.14)}`,
								},
								"& .testimonial-slider .slick-center .testimonial-card:hover": {
									transform: "scale(1.01) translateY(-3px)",
								},
							}}
						>
							<Slider ref={sliderRef} className="testimonial-slider" {...sliderSettings}>
								{data.map((testimonial, index) => (
									<Box key={testimonial?.id ?? index} sx={{ px: { xs: 0.5, md: 0.75 } }}>
										<TestimonialCard testimonial={testimonial} />
									</Box>
								))}
							</Slider>
						</Box>

						{/* Right Navigation Button */}
						<IconButton
							onClick={handleNext}
							sx={{
								position: 'absolute',
								right: { xs: -8, md: -18 },
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: alpha(theme.palette.background.paper, 0.95),
								color: theme.palette.primary.main,
								border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
								borderRadius: '50%',
								'&:hover': {
									backgroundColor: alpha(theme.palette.primary.main, 0.08),
								},
								width: { xs: 30, md: 34 },
								height: { xs: 30, md: 34 },
								display: { xs: isMobile ? "none" : "inline-flex", md: "inline-flex" },
							}}
						>
							{theme.direction === 'rtl' ? (
								<ArrowBackIos sx={{ fontSize: "18px", marginInlineEnd: "6px" }} />
							) : (
								<ArrowForwardIos sx={{ fontSize: "18px" }} />
							)}
						</IconButton>
					</Box>
				</Grid>
			</Grid>

		</Container>
	);
};

export default Testimonials;

