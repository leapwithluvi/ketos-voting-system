import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const VotingCard = ({ candidate, user }) => {
  const navigate = useNavigate();

    const handleShowVisionMission = () => {
    const missionPoints = candidate.misi ? candidate.misi.split("\n") : [];

    MySwal.fire({
      title: "Visi dan Misi",
      html: (
        <div>
          <h3>Visi</h3>
          <p>{candidate.visi}</p>
          <hr style={{ margin: "10px 0" }} />
          <h3>Misi</h3>
          <ol style={{ paddingLeft: "20px" }}>
            {missionPoints.map((item, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {item.trim()}
              </li>
            ))}
          </ol>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        container: "my-custom-swal-container",
      },
    });
  };

  const handleVote = async () => {
    const result = await Swal.fire({
      title: `Apakah yakin ingin memilih ${candidate.ketua.nama} & ${candidate.wakil.nama}?`,
      text: `Kandidat nomor ${candidate.no}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Pilih",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await api.post("/vote", {
          userId: user.id,
          candidateId: candidate.id,
        });

        Swal.fire({
          icon: "success",
          title: "Voting Berhasil",
          text: `Anda berhasil memilih ${candidate.ketua.nama} & ${candidate.wakil.nama}`,
          showConfirmButton: false,
          timer: 1500,
        });

        navigate(`/success/${candidate.no}`, { state: { user } });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Voting Gagal",
          text: err.response?.data?.message || "Terjadi error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
          buttonsStyling: false,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center w-full max-w-sm mx-auto border border-gray-200 md:max-w-5xl md:flex-row md:justify-start md:p-8">
      {/* Foto Ketua & Wakil */}
      <div className="flex space-x-4 mb-6 md:mb-0 md:mr-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-32 rounded-xl overflow-hidden border border-gray-300 md:w-32 md:h-40">
            <img
              src={candidate.ketua.imageUrl}
              alt={`Calon Ketua Osis ${candidate.ketua.nama}`}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">Calon Ketua Osis</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-32 rounded-xl overflow-hidden border border-gray-300 md:w-32 md:h-40">
            <img
              src={candidate.wakil.imageUrl}
              alt={`Calon Wakil Ketua Osis ${candidate.wakil.nama}`}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">Calon Wakil Ketua Osis</p>
        </div>
      </div>

      {/* Info & Tombol */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-grow">
        <p className="text-base font-medium text-gray-700 md:text-lg">
          NO. {candidate.no}
        </p>
        <h2 className="text-3xl font-extrabold text-gray-900 mt-1 md:text-5xl">
          {candidate.ketua.nama.toUpperCase()} &{" "}
          {candidate.wakil.nama.toUpperCase()}
        </h2>
        <div className="flex flex-col space-y-3 mt-6 w-full md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
          <button
            onClick={handleVote}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors w-full md:w-auto"
          >
            VOTING
          </button>
          <button
            onClick={handleShowVisionMission}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors w-full md:w-auto"
          >
            VISI & MISI
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingCard;
