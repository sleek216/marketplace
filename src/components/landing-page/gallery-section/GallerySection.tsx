import React, { useState } from 'react';
import Image from 'next/image';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DollarSignHighlighter from 'components/DollarSignHighlighter';
import { sanitizeBrand } from 'utils/brandFilter';

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
    title?: string;
}

interface GalleryCard {
    status: number;
    image_full_url: string;
}

interface GallerySectionData {
    gallery_section_status: number;
    gallery_content_title: string;
    gallery_content_sub_title: string;
    cards: GalleryCard[];
}

interface GallerySectionProps {
    title?: string;
    subtitle?: string;
    galleryItems?: GalleryItem[];
    gallery_section?: GallerySectionData;
}

const StyledCard = styled(Card)(({ }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: "4px",
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',

}));

const ImageWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    '& img': {
        transition: 'transform 0.3s ease-in-out',
    },
});

const ImageOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
    color: 'white',
    padding: '20px',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease-in-out',
});

const GallerySection: React.FC<GallerySectionProps> = ({
    gallery_section
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

    // Use dynamic data if available, otherwise fallback to props/defaults
    const rawTitle = gallery_section?.gallery_content_title;
    const rawSubtitle = gallery_section?.gallery_content_sub_title;

    // Replace backend brand name with frontend brand name for this section
    const dynamicTitle = sanitizeBrand(rawTitle);
    const dynamicSubtitle = sanitizeBrand(rawSubtitle);

    // Transform gallery_section cards to GalleryItem format
    const dynamicGalleryItems = gallery_section?.cards
        ?.filter(card => card.status === 1)
        ?.map((card, index) => ({
            id: index + 1,
            src: card.image_full_url,
            alt: `Gallery Image ${index + 1}`,
            title: undefined // No titles in the dynamic data
        }))

    const totalImages = dynamicGalleryItems?.length || 0;

    // Don't render if gallery_section is provided but disabled or no images
    if (gallery_section && gallery_section.gallery_section_status !== 1) {
        return null;
    }

    if (totalImages === 0) {
        return null;
    }

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 4, md: 6 },
            }}
        >
            <Container maxWidth="lg">
                {/* Title and Subtitle */}
                <Box textAlign="center" mb={3}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontSize: { xs: '1.2rem', md: '1.9rem' },
                            fontWeight: 600,
                        }}
                    >
                        <DollarSignHighlighter text={dynamicTitle} theme={theme} />
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{
                            fontSize: { xs: '.8rem', md: '1rem' },
                            color: theme.palette.text.secondary,
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.4,
                        }}
                    >
                        {dynamicSubtitle}
                    </Typography>
                </Box>

                {/* Gallery Grid */}
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    {isMobile ? (
                        <Grid
                            container
                            spacing={{ xs: 1, md: 2 }}
                            sx={{ maxWidth: "980px", width: '100%' }}
                        >
                            {dynamicGalleryItems.map((item) => (
                                <Grid item xs={6} key={item.id}>
                                    <StyledCard>
                                        <ImageWrapper
                                            sx={{
                                                // Keep all mobile cards equal so the grid stays visually balanced.
                                                height: { xs: 170, sm: 210 },
                                            }}
                                        >
                                            <Image
                                                src={item?.src}
                                                alt={item?.alt}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 768px) 50vw, 490px"
                                            />
                                        </ImageWrapper>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box
                            sx={{
                                maxWidth: "980px",
                                width: "100%",
                                display: "flex",
                                gap: "14px",
                                alignItems: "stretch",
                            }}
                        >
                            {dynamicGalleryItems.map((item) => {
                                const isHovered = hoveredImageId === item.id;
                                const hasHoveredItem = hoveredImageId !== null;

                                return (
                                    <StyledCard
                                        key={item.id}
                                        onMouseEnter={() => setHoveredImageId(item.id)}
                                        onMouseLeave={() => setHoveredImageId(null)}
                                        sx={{
                                            flex: isHovered ? 1.45 : hasHoveredItem ? 0.85 : 1,
                                            transition: "flex 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
                                            transform: isHovered ? "translateY(-4px)" : "none",
                                            boxShadow: isHovered
                                                ? "0 10px 30px rgba(21, 46, 110, 0.18)"
                                                : "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <ImageWrapper
                                            sx={{
                                                height: 340,
                                                '& img': {
                                                    objectFit: 'cover',
                                                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                                                },
                                            }}
                                        >
                                            <Image
                                                src={item?.src}
                                                alt={item?.alt}
                                                fill
                                                sizes="(max-width: 1200px) 25vw, 240px"
                                            />
                                        </ImageWrapper>
                                    </StyledCard>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default GallerySection;