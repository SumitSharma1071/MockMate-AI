
export default function Card({head, para}){

    return(
        <>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{head}</h3>
            <p>{para}</p>
          </div>
        </>
    );
}