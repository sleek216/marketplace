import React from 'react';
import { Box, Grid, Typography, Stack, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomContainer from 'components/container';
import { CheckCircle2, Truck, Clock, Package } from 'lucide-react';

// TypeScript interfaces
interface TrustCard {
    status: number;
    title: string;
    sub_title: string | null;
    image_full_url: string | null;
}

interface TrustSectionData {
    trust_section_status: number;
    cards: TrustCard[];
}

interface StatsSectionProps {
    trustSectionData?: TrustSectionData;
}

// ─── Styled Components ────────────────────────────────────────────────────────
const SectionWrapper = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(2.5),
    },
}));

const StatCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.spacing(3, 2),
    borderRadius: '4px',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.23s ease-in-out',
    cursor: 'default',
    '&:hover': {
        transform: 'translateY(-3px)',
        borderColor: theme.palette.primary.main,
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2, 1.5),
        borderRadius: '4px',
    },
}));

const IconCircle = styled(Box)(({ theme }) => ({
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
    marginBottom: theme.spacing(1.5),
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
        width: '44px',
        height: '44px',
        marginBottom: theme.spacing(1),
    },
}));

// ─── Animated Number ──────────────────────────────────────────────────────────
const AnimatedNumber = ({ valueString }: { valueString: string }) => {
    const [displayValue, setDisplayValue] = React.useState('0');
    const [isVisible, setIsVisible] = React.useState(false);
    const spanRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (spanRef.current) observer.observe(spanRef.current);
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if (!isVisible) return;
        const cleanNumber = parseFloat(valueString.replace(/,/g, ''));
        if (isNaN(cleanNumber)) { setDisplayValue(valueString); return; }

        let startTimestamp: number | null = null;
        const duration = 2000;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const cur = Math.floor(easeOut * cleanNumber);
            setDisplayValue(valueString.includes(',') ? cur.toLocaleString() : cur.toString());
            if (progress < 1) window.requestAnimationFrame(step);
            else setDisplayValue(valueString);
        };
        window.requestAnimationFrame(step);
    }, [isVisible, valueString]);

    return <span ref={spanRef}>{displayValue}</span>;
};

// ─── Text renderer with animated numbers ─────────────────────────────────────
const renderWithAnimation = (text: string): React.ReactNode => {
    if (!text) return text;
    const regex = /(\d+(?:,\d+)*(?:\.\d+)?)/g;
    const parts = text.split(regex);
    return parts.map((part, idx) =>
        /^(\d+(?:,\d+)*(?:\.\d+)?)$/.test(part)
            ? <AnimatedNumber key={idx} valueString={part} />
            : part
    );
};

// ─── Emoji → Lucide icon replacement ────────────────────────────────────────
const replaceEmojisWithIcons = (text: string, theme: any): React.ReactNode => {
    if (!text) return text;
    const emojiMap: { [key: string]: React.ReactElement } = {
        '✅': React.createElement(CheckCircle2, { size: 16, color: theme.palette.primary.main, style: { display: 'inline', verticalAlign: 'middle', marginRight: '4px' } }),
        '🚚': React.createElement(Truck, { size: 16, color: theme.palette.primary.main, style: { display: 'inline', verticalAlign: 'middle', marginRight: '4px' } }),
        '⏱': React.createElement(Clock, { size: 16, color: theme.palette.primary.main, style: { display: 'inline', verticalAlign: 'middle', marginRight: '4px' } }),
        '📦': React.createElement(Package, { size: 16, color: theme.palette.primary.main, style: { display: 'inline', verticalAlign: 'middle', marginRight: '4px' } }),
    };
    const result: React.ReactNode[] = [];
    let currentText = '';
    let i = 0;
    while (i < text.length) {
        let found = false;
        for (const [emoji, icon] of Object.entries(emojiMap)) {
            if (text.substring(i, i + emoji.length) === emoji) {
                if (currentText) { result.push(renderWithAnimation(currentText)); currentText = ''; }
                result.push(React.cloneElement(icon, { key: `icon-${i}` }));
                i += emoji.length; found = true; break;
            }
        }
        if (!found) { currentText += text[i]; i++; }
    }
    if (currentText) result.push(renderWithAnimation(currentText));
    return result.length === 1 && typeof result[0] === 'string' ? result[0] : result;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StatsSection: React.FC<StatsSectionProps> = ({ trustSectionData }) => {
    const theme = useTheme();
    const trustData = trustSectionData;

    if (!trustData || trustData.trust_section_status !== 1) return null;

    const activeCards = trustData.cards.filter(card => card.status === 1);

    const fallbackIcons = [
        <CheckCircle2 size={26} color={theme.palette.primary.main} />,
        <Truck size={26} color={theme.palette.primary.main} />,
        <Package size={26} color={theme.palette.primary.main} />,
        <Clock size={26} color={theme.palette.primary.main} />,
    ];

    return (
        <SectionWrapper>
            <CustomContainer>
                {/* Section header */}
                <Stack alignItems="center" sx={{ mb: { xs: 2, md: 3 } }}>
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
                        Why Choose Us
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: '20px', sm: '24px', md: '26px' },
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            letterSpacing: '-0.01em',
                            textAlign: 'center',
                        }}
                    >
                        Trusted by Millions
                    </Typography>
                </Stack>

                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {activeCards.map((card: TrustCard, index: number) => (
                        <Grid item xs={6} sm={6} md={3} key={index}>
                            <StatCard>
                                <IconCircle>
                                    {card.image_full_url ? (
                                        <img
                                            src={card.image_full_url}
                                            alt={card.sub_title || card.title}
                                            style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        fallbackIcons[index % fallbackIcons.length]
                                    )}
                                </IconCircle>

                                <Typography
                                    sx={{
                                        fontSize: { xs: '20px', sm: '24px', md: '28px' },
                                        fontWeight: 800,
                                        color: theme.palette.primary.main,
                                        lineHeight: 1.2,
                                        letterSpacing: '-0.02em',
                                        mb: 0.5,
                                    }}
                                >
                                    {replaceEmojisWithIcons(card.title, theme)}
                                </Typography>

                                {card.sub_title && (
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '11px', sm: '13px' },
                                            fontWeight: 500,
                                            color: theme.palette.text.secondary,
                                            lineHeight: 1.4,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {replaceEmojisWithIcons(card.sub_title, theme)}
                                    </Typography>
                                )}
                            </StatCard>
                        </Grid>
                    ))}
                </Grid>
            </CustomContainer>
        </SectionWrapper>
    );
};

export default StatsSection;