import React from "react";

const CandidateCard = ({ candidate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col w-full max-w-sm mx-auto">
      {/* Header */}
      <h3 className="text-sm font-bold text-gray-600 mb-1">
        NO. {candidate.no}
      </h3>
      <h2 className="text-lg font-bold text-gray-900">
        {candidate.ketua.nama} & {candidate.wakil.nama}
      </h2>
      <p className="text-gray-500 text-xs mb-6">{candidate.slogan}</p>

      {/* Foto Ketua & Wakil */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Ketua */}
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
          <img
            src={candidate.ketua.imageUrl}
            alt={candidate.ketua.nama}
            className="w-28 h-36 object-cover rounded-lg mb-2"
          />
          <p className="font-semibold text-sm">{candidate.ketua.nama}</p>
          <p className="text-xs text-gray-500">Calon Ketua Osis</p>
          <p className="text-xs text-gray-600">{candidate.ketua.kelas}</p>
        </div>

        {/* Wakil */}
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
          <img
            src={candidate.wakil.imageUrl}
            alt={candidate.wakil.nama}
            className="w-28 h-36 object-cover rounded-lg mb-2"
          />
          <p className="font-semibold text-sm">{candidate.wakil.nama}</p>
          <p className="text-xs text-gray-500">Calon Wakil Ketua Osis</p>
          <p className="text-xs text-gray-600">{candidate.wakil.kelas}</p>
        </div>
      </div>

      {/* Jurusan Terkait */}
      <div className="mt-auto">
        <p className="text-xs font-semibold text-gray-600 mb-2">
          Jurusan terkait
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            {candidate.jurusan.map((logo, i) => (
              <img key={i} src={logo} alt="jurusan" className="w-10 h-10" />
            ))}
          </div>

          <button
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Visi & Misi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
