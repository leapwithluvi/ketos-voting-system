import React from "react";
import CandidateCard from "../Candidate/CandidateCard";

const CandidateSection = ({ candidates }) => {
  return (
    <section className="bg-white w-full py-8 sm:py-10 flex flex-col items-center">
      <div className="w-full flex justify-center mb-10">
        <h2 className="text-gray-900 font-bold whitespace-nowrap text-center sm:text-4xl">
          KANDIDAT KETUA & WAKIL KETUA OSIS
        </h2>
      </div>

      {/* Kandidat Section */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4 justify-center">
        {candidates.map((c) => (
          <CandidateCard key={c.no} candidate={c} />
        ))}
      </div>
    </section>
  );
};

export default CandidateSection;
