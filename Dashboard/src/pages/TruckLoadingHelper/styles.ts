/**
 * Shared styles for all TruckLoadingHelper components
 * This ensures a consistent look and feel across all pages
 * 
 * Color Scheme:
 * - Primary/Accent: Orange/coral (#E28743)
 * - Background: White for main page, soft beige/cream for tool icons and cards
 * - Text: Dark gray/black for headings and text, light gray for secondary elements
 */

// Define color variables to maintain consistency
const colors = {
  accent: '#E28743',        // Orange/coral accent color
  accentHover: '#D07A3B',   // Slightly darker accent for hover states
  accentLight: '#F9EFE6',   // Very light beige for backgrounds
  cardBg: '#FFFFFF',        // White background for cards
  cardBorder: '#E5E7EB',    // Light gray for borders
  textPrimary: '#1F2937',   // Dark gray for primary text
  textSecondary: '#6B7280', // Medium gray for secondary text
  searchBg: '#F3F4F6',      // Light gray for search box
  pending: '#FEF3C7',       // Light yellow background for pending status
  pendingText: '#D97706',   // Amber text for pending status
  loaded: '#DBEAFE',        // Light blue background for loaded status
  loadedText: '#2563EB',    // Blue text for loaded status
  delivered: '#D1FAE5',     // Light green background for delivered status
  deliveredText: '#059669'  // Green text for delivered status
};

export const styles = {
  // Page and container styles
  pageContainer: "p-6 bg-white",
  contentContainer: `bg-white rounded-lg border border-[${colors.cardBorder}]`,
  sectionContainer: "mb-6",
  
  // Text styles
  pageTitle: `text-2xl font-bold mb-6 flex items-center text-[${colors.textPrimary}]`,
  sectionTitle: `text-xl font-bold mb-4 flex items-center text-[${colors.textPrimary}]`,
  subSectionTitle: `text-lg font-semibold mb-3 flex items-center text-[${colors.textPrimary}]`,
  cardTitle: `font-medium flex items-center text-[${colors.textPrimary}]`,
  
  // Card styles
  card: `p-4 border border-[${colors.cardBorder}] rounded-lg hover:border-[${colors.accent}] hover:shadow-sm cursor-pointer transition-all bg-white`,
  infoCard: `p-3 bg-[${colors.accentLight}] rounded-lg`,
  iconContainer: `p-3 rounded-full bg-[${colors.accentLight}] flex items-center justify-center`,
  
  // Button styles
  primaryButton: `px-4 py-2 bg-[${colors.accent}] text-white rounded-lg hover:bg-[${colors.accentHover}] transition-colors flex items-center font-medium`,
  secondaryButton: `px-3 py-1.5 rounded-lg border border-[${colors.cardBorder}] hover:bg-[${colors.accentLight}] transition-colors text-sm flex items-center text-[${colors.textPrimary}]`,
  iconButton: `p-2 rounded-lg bg-[${colors.accentLight}] hover:bg-[${colors.accent}]/20 text-[${colors.accent}] flex items-center text-sm`,
  
  // Form styles
  input: `w-full p-2 border border-[${colors.cardBorder}] rounded-lg text-sm bg-[${colors.searchBg}] focus:outline-none focus:ring-1 focus:ring-[${colors.accent}]`,
  textarea: `w-full p-2 text-sm border border-[${colors.cardBorder}] rounded-lg mb-2 min-h-[80px] bg-[${colors.searchBg}] focus:outline-none focus:ring-1 focus:ring-[${colors.accent}]`,
  searchBox: `pl-10 pr-4 py-2 border border-[${colors.cardBorder}] rounded-lg w-full md:w-80 bg-[${colors.searchBg}] focus:outline-none focus:ring-1 focus:ring-[${colors.accent}]`,
  
  // Tab styles
  tabContainer: `border-b border-[${colors.cardBorder}] mb-6 flex`,
  activeTab: `px-4 py-2 font-medium text-sm border-b-2 border-[${colors.accent}] text-[${colors.accent}] flex items-center`,
  inactiveTab: `px-4 py-2 font-medium text-sm border-b-2 border-transparent flex items-center text-[${colors.textSecondary}] hover:text-[${colors.textPrimary}]`,
  
  // Status badges
  pendingBadge: `px-3 py-1 rounded-full text-sm bg-[${colors.pending}] text-[${colors.pendingText}]`,
  loadedBadge: `px-3 py-1 rounded-full text-sm bg-[${colors.loaded}] text-[${colors.loadedText}]`,
  deliveredBadge: `px-3 py-1 rounded-full text-sm bg-[${colors.delivered}] text-[${colors.deliveredText}]`,
  
  // Small badges for cards
  smallPendingBadge: `px-2 py-0.5 rounded-full text-xs bg-[${colors.pending}] text-[${colors.pendingText}]`,
  smallLoadedBadge: `px-2 py-0.5 rounded-full text-xs bg-[${colors.loaded}] text-[${colors.loadedText}]`,
  smallDeliveredBadge: `px-2 py-0.5 rounded-full text-xs bg-[${colors.delivered}] text-[${colors.deliveredText}]`,
  
  // Grid layouts
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  twoColumnGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  
  // Tables
  table: `w-full min-w-[500px] border-collapse`,
  tableHeader: `py-2 px-4 text-left border-b border-[${colors.cardBorder}] text-[${colors.textSecondary}] font-medium`,
  tableCell: `py-2 px-4 text-[${colors.textPrimary}]`,
  tableRow: `border-b border-[${colors.cardBorder}] hover:bg-[${colors.accentLight}] transition-colors`,
  
  // Special containers
  formContainer: `p-4 border border-[${colors.cardBorder}] rounded-lg mb-6 bg-white`,
  notificationContainer: `p-4 border border-[${colors.cardBorder}] rounded-lg bg-[${colors.accentLight}]`,
  specialNotesContainer: `p-4 border rounded-lg bg-[${colors.pending}]/50 border-[${colors.pendingText}]/30`,
  emptyStateContainer: `text-center py-6 border border-[${colors.cardBorder}] rounded-lg bg-white text-[${colors.textSecondary}]`,
  
  // Customer and order item styles
  customerCard: `rounded-lg border border-[${colors.cardBorder}] hover:border-[${colors.accent}] transition-colors overflow-hidden group cursor-pointer bg-white shadow-sm`,
  orderItem: `bg-white border border-[${colors.cardBorder}] p-3 rounded-lg cursor-pointer transition-colors hover:border-[${colors.accent}] hover:shadow-sm`,
  
  // Status tags with orange accent
  statusTag: `px-3 py-1 rounded-full text-sm bg-[${colors.accent}]/10 text-[${colors.accent}] font-medium`,
  smallStatusTag: `px-2 py-0.5 rounded-full text-xs bg-[${colors.accent}]/10 text-[${colors.accent}] font-medium`
};

// Helper function to get status badge based on status
export const getStatusBadge = (status: 'pending' | 'loaded' | 'delivered', small: boolean = false) => {
  if (small) {
    if (status === 'pending') return styles.smallPendingBadge;
    if (status === 'loaded') return styles.smallLoadedBadge;
    return styles.smallDeliveredBadge;
  } else {
    if (status === 'pending') return styles.pendingBadge;
    if (status === 'loaded') return styles.loadedBadge;
    return styles.deliveredBadge;
  }
};

// Helper function to get status icon color based on status
export const getStatusIcon = (status: 'pending' | 'loaded' | 'delivered') => {
  if (status === 'pending') return 'text-[#D97706]'; // Orange for pending
  if (status === 'loaded') return 'text-[#2563EB]';  // Blue for loaded
  return 'text-[#059669]';                           // Green for delivered
};

// Helper function to get accent color styles
export const getAccentStyles = () => {
  return {
    primary: '#E28743',
    light: '#F9EFE6',
    hover: '#D07A3B',
    background: 'bg-[#F9EFE6]',
    text: 'text-[#E28743]',
    border: 'border-[#E28743]',
    btnBg: 'bg-[#E28743]'
  };
};
