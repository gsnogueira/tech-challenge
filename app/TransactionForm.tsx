"use client";
import { useState } from "react";

export default function TransactionForm({ onSave, initial }:{ onSave: (t:any)=>void; initial?: any }){
  const [type, setType] = useState(initial?.type||"deposit");
  const [description, setDescription] = useState(initial?.description||"");
  const [amount, setAmount] = useState(initial?.amount||0);
  const [date, setDate] = useState(initial?.date||new Date().toISOString().slice(0,10));

  function submit(e: any){
    e.preventDefault();
    onSave({ id: initial?.id || String(Date.now()), type, description, amount: Number(amount), date });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <select value={type} onChange={e=>setType(e.target.value)} className="flex-1 border rounded px-2 py-1">
          <option value="deposit">Depósito</option>
          <option value="withdrawal">Retirada</option>
          <option value="transfer">Transferência</option>
        </select>
        <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" step="0.01" className="w-36 border rounded px-2 py-1" placeholder="Valor" />
      </div>
      <input value={description} onChange={e=>setDescription(e.target.value)} className="border rounded px-2 py-1" placeholder="Descrição" />
      <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="border rounded px-2 py-1" />
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-sky-600 text-white rounded">Salvar</button>
      </div>
    </form>
  );
}
