import React from "react";
import VotingCard from "./VotingCard";

const VotingSection = ({ votings, user }) => {
  return (
    <section className="bg-white w-full py-8 sm:py-10 flex flex-col items-center">
      <div className="grid gap-6 grid-cols-1 w-full max-w-6xl px-4 justify-center">
        {votings.map((c) => (
          <VotingCard key={c.no} candidate={c} user={user} />
        ))}
      </div>
    </section>
  );
};

export default VotingSection;
