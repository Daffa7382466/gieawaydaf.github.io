import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RobloxQuiz() {
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const questions = [
    { q: "Apa nama mata uang di Roblox?", a: "Robux", hard: false },
    { q: "Siapa pencipta Roblox?", a: "David Baszucki", hard: false },
    { q: "Game apa yang populer dengan mode bertahan hidup zombie di Roblox?", a: "Zombie Rush", hard: false },
    { q: "Tahun berapa Roblox dirilis secara publik?", a: "2006", hard: false },
    { q: "Apa nama studio yang membuat Roblox?", a: "Roblox Corporation", hard: false },
    { q: "Apa nama event tahunan besar di Roblox?", a: "Bloxy Awards", hard: true },
    { q: "Apa nama sistem fisika yang digunakan Roblox?", a: "Havok", hard: true },
    { q: "Berapa maksimal teman di Roblox?", a: "200", hard: true },
    { q: "Apa nama bahasa pemrograman utama yang digunakan di Roblox Studio?", a: "Lua", hard: true },
    { q: "Siapa yang pertama kali menciptakan istilah 'Roblox'?", a: "Erik Cassel", hard: true },
  ];

  const correctCount = questions.filter(
    (q, i) => answers[i]?.toLowerCase().trim() === q.a.toLowerCase()
  ).length;

  const handleSubmit = () => {
    setSubmitted(true);
    const newScore = { name: savedName, score: correctCount };
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    localStorage.setItem("robloxScores", JSON.stringify(updatedScores));
  };

  useEffect(() => {
    const stored = localStorage.getItem("robloxScores");
    if (stored) {
      setScores(JSON.parse(stored));
    }
  }, []);

  if (!savedName) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Masukkan Nama Anda</h1>
        <Input
          placeholder="Nama..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={() => setSavedName(name)} disabled={!name}>Mulai</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz Roblox</h1>
      {!submitted ? (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="font-medium mb-2">{i + 1}. {q.q}</p>
                <Input
                  placeholder="Jawaban..."
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                />
              </CardContent>
            </Card>
          ))}
          <Button onClick={handleSubmit}>Kumpulkan Jawaban</Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Hasil untuk {savedName}</h2>
          <p className="mt-2">Benar: {correctCount} dari {questions.length}</p>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Leaderboard</h3>
            <div className="space-y-1">
              {scores.map((s, i) => (
                <p key={i}>{i + 1}. {s.name} - {s.score} benar</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
