const shapes = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  play: <path d="m8 5 12 7-12 7V5Z"/>,
  'play-circle': <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  'arrow-up-right': <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
  book: <><path d="M4 4.5C4 3.7 4.7 3 7 3h13v17H7a3 3 0 0 0-3 3V4.5Z"/><path d="M4 18c0-1.7 1.3-3 3-3h13"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  video: <><rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-3v10l-4-3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="M18 6 6 18M6 6l12 12"/>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  sparkle: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m20 17 .7 2.3L23 20l-2.3.7L20 23l-.7-2.3L17 20l2.3-.7L20 17Z"/></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14-5L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14 5l2-2"/><path d="M15 16h5v5"/></>,
  bookmark: <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4V4Z"/>,
  'chevron-right': <path d="m9 18 6-6-6-6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></>,
  'external-link': <><path d="M13 5h6v6M19 5l-9 9"/><path d="M19 13v6H5V5h6"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  'alert-circle': <><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></>,
};

export default function Icon({ name, size = 20, className = '', fill = 'none', ...props }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" {...props}>
      {shapes[name] ?? shapes.sparkle}
    </svg>
  );
}
