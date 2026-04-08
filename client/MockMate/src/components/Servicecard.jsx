export default function ServiceCard({icon, title, desc}) {
  return (
    <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}