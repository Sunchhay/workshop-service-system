import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#18181b',
        borderRadius: 8,
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 800,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      W
    </div>,
    { ...size },
  );
}
