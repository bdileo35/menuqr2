"use client";
import { ClickToComponent } from 'click-to-react-component';

export default function DevClickToComponent() {
  if (typeof window === 'undefined') return null;
  if (process.env.NODE_ENV === 'production') return null;
  return <ClickToComponent />;
}





