"use client";

export default function TransactionList({ items, onDelete, onEdit }:{ items:any[]; onDelete?: (id:string)=>void; onEdit?: (t:any)=>void }){
  return (
    <div className="flex flex-col gap-2">
      {items.map(item=> (
        <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
          <div>
            <div className="font-medium">{item.description}</div>
            <div className="text-sm text-gray-500">{item.date} • {item.type}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`${item.amount<0? 'text-red-600':'text-green-600'} font-medium`}>{item.amount.toLocaleString(undefined,{style:'currency',currency:'USD'})}</div>
            {onEdit && <button onClick={()=>onEdit(item)} className="text-sm text-sky-600">Editar</button>}
            {onDelete && <button onClick={()=>onDelete(item.id)} className="text-sm text-red-600">Excluir</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
