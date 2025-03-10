export default function UserProfile({ params }: any) {
  return (
    <div>
      <h1 className="p-2 rounded bg-orange-500">{params.id}</h1>
    </div>
  );
}
