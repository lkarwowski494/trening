import { useLeave } from '@/components/leave';

/** Nieznany adres (np. literówka w linku): wracamy tam, skąd przyszedł link, bez deweloperskiego „Unmatched Route”. */
export default function NotFound() { useLeave(); return null; }
