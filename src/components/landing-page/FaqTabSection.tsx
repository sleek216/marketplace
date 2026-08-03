import React, { useState } from 'react';
import {
    alpha,
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { t } from 'i18next';
import { useRouter } from 'next/router';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    user_type: string;
    status: number;
}

interface FaqSectionData {
    faq_section_status: number;
    faq_title: string;
    faq_list: FaqItem[];
}

interface FaqTabSectionProps {
    faq_section?: FaqSectionData;
}

interface FaqTab {
    label: string;
    icon: React.ReactNode;
    type: 'customer' | 'restaurant' | 'deliveryman';
}

const FaqTabSection: React.FC<FaqTabSectionProps> = ({ faq_section }) => {
    const theme = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [expandedAccordion, setExpandedAccordion] = useState<number | false>(false);

    // Prevent rendering when FAQ section is disabled
    if (faq_section && faq_section.faq_section_status !== 1) {
        return null;
    }

    // Filter FAQ data
    const dynamicCustomerFaqs = faq_section?.faq_list?.filter(
        faq => faq.user_type === 'customer' && faq.status === 1
    );

    const dynamicSellerFaqs = faq_section?.faq_list?.filter(
        faq => faq.user_type === 'vendor' && faq.status === 1
    );

    const dynamicDriverFaqs = faq_section?.faq_list?.filter(
        faq => faq.user_type === 'deliveryman' && faq.status === 1
    );

    // Build dynamic tabs
    const tabs: FaqTab[] = [];

    if (dynamicCustomerFaqs?.length) {
        tabs.push({
            label: "I'm a Customer",
            icon: <PersonIcon />,
            type: "customer"
        });
    }

    if (dynamicSellerFaqs?.length) {
        tabs.push({
            label: "I'm a Seller",
            icon: <StorefrontIcon />,
            type: "restaurant"
        });
    }

    if (dynamicDriverFaqs?.length) {
        tabs.push({
            label: "I'm a Rider",
            icon: <DirectionsCarIcon />,
            type: "deliveryman"
        });
    }

    // Get current FAQ list
    const getCurrentFaqs = () => {
        const tabType = tabs[activeTab]?.type;

        if (tabType === "customer") return dynamicCustomerFaqs;
        if (tabType === "restaurant") return dynamicSellerFaqs;
        if (tabType === "deliveryman") return dynamicDriverFaqs;

        return [];
    };

    const handleAccordionChange = (panel: number) => (_event: any, isExpanded: boolean) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        setExpandedAccordion(false);
    };

    const currentFaqs = getCurrentFaqs();

    return (
        <Box
            component="section"
            sx={{
                pt: { xs: 3, sm: 4, md: 5 },
                pb: { xs: 1, sm: 2, md: 2.5 },
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box maxWidth="lg" sx={{ mx: 'auto', px: { xs: 1.2, sm: 2 } }}>
                <Box sx={{ maxWidth: '940px', mx: 'auto' }}>

                    {/* Title */}
                    <Box textAlign="center" mb={{ xs: 2, sm: 3 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: '11px', sm: '12px' },
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                color: theme.palette.text.secondary,
                                mb: 0.5,
                            }}
                        >
                            FAQ
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '20px', sm: '24px', md: '26px' },
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {faq_section?.faq_title || t('Frequently Asked Questions')}
                        </Typography>
                    </Box>

                    {/* Dynamic Tabs */}
                    {tabs.length > 0 && (
                        <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
                            <Stack
                                direction="row"
                                flexWrap="nowrap"
                                justifyContent="center"
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    gap: { xs: 0.7, sm: 1 },
                                    p: { xs: '4px', sm: '6px' },
                                    borderRadius: '4px',
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.neutral[800]
                                            : theme.palette.neutral[100],
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                {tabs.map((tab, index) => {
                                    const isActive = activeTab === index;
                                    return (
                                        <Box
                                            key={index}
                                            onClick={() => handleTabChange(index)}
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                px: { xs: 1.1, sm: 2 },
                                                py: { xs: 0.85, sm: 1 },
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                userSelect: 'none',
                                                minHeight: { xs: 38, sm: 40 },
                                                flex: 1,
                                                justifyContent: 'center',
                                                minWidth: 0,
                                                transition: 'all 0.2s ease',
                                                backgroundColor: isActive
                                                    ? theme.palette.primary.main
                                                    : 'transparent',
                                                color: isActive
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.secondary,
                                                '&:hover': {
                                                    backgroundColor: isActive
                                                        ? theme.palette.primary.main
                                                        : theme.palette.action.hover,
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'inline-flex', lineHeight: 0 }}>
                                                <Box sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: '0.95rem', sm: '1.15rem' } } }}>
                                                    {tab.icon}
                                                </Box>
                                            </Box>
                                            <Typography
                                                sx={{
                                                    fontSize: { xs: '0.68rem', sm: '0.86rem' },
                                                    fontWeight: 700,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {t(tab.label)}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}

                    {/* FAQ List */}
                    <Box sx={{ width: '100%', mx: 'auto' }}>
                        {currentFaqs?.length ? (
                            currentFaqs.map((faq) => (
                                <Accordion
                                    key={faq.id}
                                    expanded={expandedAccordion === faq.id}
                                    onChange={handleAccordionChange(faq.id)}
                                    sx={{
                                        mb: { xs: 1, sm: 1.2 },
                                        borderRadius: '4px !important',
                                        overflow: 'hidden',
                                        border: `1px solid ${theme.palette.divider}`,
                                        backgroundColor:
                                            theme.palette.mode === 'dark'
                                                ? theme.palette.background.paper
                                                : theme.palette.common.white,
                                        boxShadow:
                                            expandedAccordion === faq.id
                                                ? theme.palette.mode === 'dark'
                                                    ? '0px 10px 20px rgba(0,0,0,0.35)'
                                                    : '0px 10px 20px rgba(17,24,39,0.08)'
                                                : 'none',
                                        '&:before': { display: 'none' },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <Box
                                                sx={{
                                                    width: { xs: 24, sm: 26 },
                                                    height: { xs: 24, sm: 26 },
                                                    borderRadius: '50%',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor:
                                                        expandedAccordion === faq.id
                                                            ? theme.palette.primary.main
                                                            : theme.palette.action.hover,
                                                    color:
                                                        expandedAccordion === faq.id
                                                            ? theme.palette.primary.contrastText
                                                            : theme.palette.primary.main,
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {expandedAccordion === faq.id ? (
                                                    <RemoveIcon fontSize="small" />
                                                ) : (
                                                    <AddIcon fontSize="small" />
                                                )}
                                            </Box>
                                        }
                                        sx={{
                                            px: { xs: 1.2, sm: 2 },
                                            py: { xs: 0.2, sm: 0.35 },
                                            minHeight: { xs: 54, sm: 56 },
                                            backgroundColor:
                                                expandedAccordion === faq.id
                                                    ? theme.palette.action.hover
                                                    : 'transparent',
                                            '& .MuiAccordionSummary-expandIconWrapper': {
                                                marginRight: { xs: '-2px', sm: 0 },
                                            },
                                            '& .MuiAccordionSummary-content': {
                                                my: { xs: 0.9, sm: 1.2 },
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.82rem', sm: '1rem', md: '1.06rem' },
                                                fontWeight: 700,
                                                pr: { xs: 0.5, sm: 1 },
                                                lineHeight: 1.45,
                                                color:
                                                    expandedAccordion === faq.id
                                                        ? theme.palette.primary.main
                                                        : theme.palette.text.primary,
                                            }}
                                        >
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>

                                    <AccordionDetails
                                        sx={{
                                            px: { xs: 1.2, sm: 2 },
                                            pt: 0,
                                            pb: { xs: 1.3, sm: 1.8 },
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.8rem', sm: '0.93rem' },
                                                lineHeight: { xs: 1.65, sm: 1.75 },
                                                color: theme.palette.text.secondary,
                                            }}
                                        >
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    border: `1px dashed ${theme.palette.divider}`,
                                    borderRadius: '4px',
                                    p: { xs: 2.5, sm: 3 },
                                    textAlign: 'center',
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.neutral[800]
                                            : theme.palette.neutral[100],
                                }}
                            >
                                <Typography sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                    {t('No FAQs available right now')}
                                </Typography>
                                <Typography sx={{ mt: 0.8, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                    {t('Please check back later for updates.')}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        mt={{ xs: 2.2, sm: 3 }}
                        sx={{
                            borderRadius: '4px',
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.primary.main, 0.08)
                                    : alpha(theme.palette.primary.main, 0.04),
                            px: { xs: 1.5, sm: 2.5 },
                            py: { xs: 1.5, sm: 2 },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '0.92rem', sm: '1rem' },
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('Still have questions?')}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '0.76rem', sm: '0.86rem' },
                                color: theme.palette.text.secondary,
                                textAlign: 'center',
                            }}
                        >
                            {t('Reach out to our support team and we will be happy to help.')}
                        </Typography>
                        <Box
                            onClick={() => router.push('/help-and-support')}
                            sx={{
                                cursor: 'pointer',
                                borderRadius: '4px',
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.7, sm: 0.85 },
                                fontSize: { xs: '0.75rem', sm: '0.84rem' },
                                fontWeight: 700,
                                color: theme.palette.primary.contrastText,
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            {t('Contact us')}
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default FaqTabSection;
