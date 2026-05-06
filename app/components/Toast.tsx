"use client";

import React from "react";
import { useTx } from "../context/TxContext";

export default function Toast(){
  const { toast } = useTx();
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type} show`} style={{position:'fixed',bottom:20,right:20,zIndex:999}}>
      <div className="toast-dot" style={{background: toast.type==='success'? 'var(--c-green)': 'var(--c-red)'}}></div>
      <span style={{marginLeft:8}}>{toast.msg}</span>
    </div>
  );
}
