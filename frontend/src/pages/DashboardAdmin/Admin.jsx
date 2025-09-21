import React, { useState, useEffect, useMemo } from "react";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { api } from "../../api/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const exportPDF = async (data, chartData) => {
  if (!data || data.length === 0) {
    return MySwal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Tidak ada data untuk diexport!",
    });
  }

  const doc = new jsPDF("p", "mm", "a4");
  const margin = 10;
  let yPosition = margin;

  doc.setFontSize(20);
  doc.setTextColor(51, 51, 51);
  doc.text("Laporan Hasil Voting Kandidat", margin, yPosition + 5);
  yPosition += 15;

  doc.setFontSize(14);
  doc.setTextColor(102, 102, 102);
  doc.text("Ringkasan Hasil", margin, yPosition);
  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(51, 51, 51);
  doc.text(`Total Kandidat: ${data.length}`, margin, yPosition);
  yPosition += 5;
  const totalVotes = data.reduce((s, c) => s + (c.votesCount || 0), 0);
  doc.text(`Total Votes: ${totalVotes}`, margin, yPosition);
  yPosition += 15;

  if (chartData && chartData.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(102, 102, 102);
    doc.text("Diagram Hasil Voting", margin, yPosition);
    yPosition += 5;

    const chartElement = document.getElementById("pie-chart-container");
    if (chartElement) {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    }
  }

  doc.setFontSize(14);
  doc.setTextColor(102, 102, 102);
  doc.text("Daftar Kandidat", margin, yPosition);
  yPosition += 8;

  const tableColumn = [
    "No",
    "Ketua",
    "Kelas",
    "Wakil",
    "Kelas",
    "Slogan",
    "Votes",
  ];

  const tableRows = data.map((c) => [
    String(c.no || ""),
    String(c.ketua?.nama || ""),
    String(c.ketua?.kelas || ""),
    String(c.wakil?.nama || ""),
    String(c.wakil?.kelas || ""),
    String(c.slogan || ""),
    String(c.votesCount || 0),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: yPosition,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
      halign: "center",
    },
    headStyles: {
      fillColor: [60, 179, 113],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [51, 51, 51],
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 25 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 25 },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: "auto", minCellWidth: 50, halign: "center" },
      6: { cellWidth: 15, halign: "center" },
    },
    didDrawPage: (hookData) => {
      doc.setFontSize(10);
      doc.text(
        `Halaman ${hookData.pageNumber} dari ${doc.internal.pages.length}`,
        doc.internal.pageSize.getWidth() - margin,
        doc.internal.pageSize.getHeight() - margin,
        { align: "right" }
      );
    },
  });

  doc.save(`laporan_kandidat_${Date.now()}.pdf`);
};

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#ef4444", "#a78bfa"];

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({ name: "", description: "", votes: 0 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/candidates");
        setCandidates(res.data.data);
      } catch (err) {
        console.error("Gagal load candidates", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/results");
        setResults(res.data.data);
      } catch (err) {
        console.error("Gagal ambil results:", err);
      }
    };

    fetchResults();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", votes: 0 });
    setIsOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);

    setForm({
      no: c.no || "",
      ketuaNama: c.ketua?.nama || "",
      ketuaKelas: c.ketua?.kelas || "",
      wakilNama: c.wakil?.nama || "",
      wakilKelas: c.wakil?.kelas || "",
      visi: c.visi || "",
      misi: c.misi || "",
      slogan: c.slogan || "",
      ketuaImg: null,
      wakilImg: null,
      jurusanImg1: null,
      jurusanImg2: null,
    });

    setIsOpen(true);
  };

  const onSave = async () => {
    if (!form.no || !form.ketuaNama || !form.wakilNama) {
      return alert("No, Ketua, dan Wakil wajib diisi");
    }

    try {
      const fd = new FormData();
      fd.append("no", form.no);
      fd.append("ketuaNama", form.ketuaNama);
      fd.append("ketuaKelas", form.ketuaKelas);
      fd.append("wakilNama", form.wakilNama);
      fd.append("wakilKelas", form.wakilKelas);
      fd.append("visi", form.visi);
      fd.append("misi", form.misi);
      fd.append("slogan", form.slogan);

      if (form.ketuaImg) fd.append("ketuaImg", form.ketuaImg);
      if (form.wakilImg) fd.append("wakilImg", form.wakilImg);
      if (form.jurusanImg1) fd.append("jurusanImg", form.jurusanImg1);
      if (form.jurusanImg2) fd.append("jurusanImg", form.jurusanImg2);

      let res;
      if (editing) {
        res = await api.patch(`admin/candidates/${editing.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCandidates((prev) =>
          prev.map((c) => (c.id === editing.id ? res.data.data : c))
        );
      } else {
        res = await api.post("admin/candidates", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCandidates((prev) => [res.data.data, ...prev]);
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Gagal simpan kandidat", err);
    }
  };

  const onDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Hapus Kandidat?",
      text: "Kamu tidak bisa mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`admin/candidates/${id}`);
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        MySwal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Kandidat berhasil dihapus.",
        });
      } catch (err) {
        console.error("Gagal hapus kandidat", err);
        MySwal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus kandidat.",
        });
      }
    }
  };

  const mergedResults = useMemo(() => {
    return candidates.map((c) => ({
      ...c,
      votesCount: results.find((r) => r.candidateId === c.id)?.votesCount || 0,
      ketua: {
        ...c.ketua,
        img: c.ketua?.imageUrl || null,
      },
      wakil: {
        ...c.wakil,
        img: c.wakil?.imageUrl || null,
      },
      jurusan: c.jurusan || [],
    }));
  }, [candidates, results]);

  const chartData = mergedResults
    .map((c) => ({
      name: `${c.ketua?.nama} & ${c.wakil?.nama}`,
      value: c.votesCount || 0,
    }))
    .filter((c) => c.value > 0);

  console.log("Merged Results", mergedResults);

  return (
    <div>
      <AdminNavbar />
      <div className="bg-gray-100 p-6 sm:p-10">
        <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Ringkasan Statistik */}
                <Card className="bg-white shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle>Ringkasan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <div className="text-xs font-semibold text-blue-500">
                          Total Kandidat
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {candidates.length}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <div className="text-xs font-semibold text-green-500">
                          Total Votes
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {results.reduce((s, r) => s + r.votesCount, 0)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" onClick={openCreate}>
                      Tambah Kandidat
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (mergedResults.length === 0)
                          return alert("Data masih kosong");
                        exportPDF(mergedResults, chartData);
                      }}
                    >
                      Export PDF
                    </Button>
                  </CardContent>
                </Card>

                {/* Info / Tips */}
                <Card className="bg-white shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle>Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>
                        Pastikan nomor urut kandidat unik (tidak boleh sama!).
                      </li>
                      <li>Gunakan slogan yang jelas dan singkat.</li>
                      <li>Klik "Edit" untuk mengubah data kandidat.</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </aside>

            {/* Main Content */}
            <main className="col-span-12 lg:col-span-9 space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Dashboard Kandidat
              </h1>

              {/* Kandidat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mergedResults.map((r) => (
                  <Card
                    key={r.id}
                    className="shadow-lg hover:shadow-2xl transition duration-300 rounded-xl"
                  >
                    <CardContent className="flex flex-col gap-2">
                      <div className="font-bold text-lg">
                        {r.ketua?.nama} & {r.wakil?.nama}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {r.slogan || r.visi}
                      </div>
                      <div className="text-xs text-gray-400">
                        {r.ketua?.kelas} | {r.wakil?.kelas}
                      </div>
                      <div className="text-right mt-2">
                        <div className="text-sm text-gray-400">Votes</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {r.votesCount}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chart */}
              <Card className="bg-white shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Hasil Voting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        innerRadius={60}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        isAnimationActive
                      >
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} votes`, "Votes"]}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Kandidat Table */}
              <Card className="bg-white shadow-lg rounded-xl overflow-x-auto">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Daftar Kandidat</CardTitle>
                  <Button
                    onClick={openCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Tambah Kandidat
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="bg-gray-100 sticky top-0">
                        <TableHead>No</TableHead>
                        <TableHead>Ketua</TableHead>
                        <TableHead>Foto Ketua</TableHead>
                        <TableHead>Wakil</TableHead>
                        <TableHead>Foto Wakil</TableHead>
                        <TableHead>Visi</TableHead>
                        <TableHead>Misi</TableHead>
                        <TableHead>Slogan</TableHead>
                        <TableHead>Jurusan</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mergedResults.map((c) => (
                        <TableRow
                          key={c.id}
                          className="hover:bg-gray-50 transition duration-200"
                        >
                          <TableCell>{c.no}</TableCell>
                          <TableCell>{c.ketua?.nama}</TableCell>
                          <TableCell>
                            {c.ketua?.img && (
                              <img
                                src={c.ketua.img}
                                alt={c.ketua.nama}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            )}
                          </TableCell>
                          <TableCell>{c.wakil?.nama}</TableCell>
                          <TableCell>
                            {c.wakil?.img && (
                              <img
                                src={c.wakil.img}
                                alt={c.wakil.nama}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            )}
                          </TableCell>
                          <TableCell className="truncate max-w-xs">
                            {c.visi}
                          </TableCell>
                          <TableCell className="truncate max-w-xs">
                            {c.misi}
                          </TableCell>
                          <TableCell className="truncate max-w-xs">
                            {c.slogan}
                          </TableCell>
                          <TableCell>
                            {c.jurusan?.map((j, i) => (
                              <img
                                key={i}
                                src={j}
                                alt={`jurusan-${i}`}
                                className="h-6 inline-block mr-1"
                              />
                            ))}
                          </TableCell>
                          <TableCell>{c.votesCount}</TableCell>
                          <TableCell>
                            {new Date(c.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {new Date(c.updated_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(c)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDelete(c.id)}
                            >
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>

      {/* Dialog create/edit */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Kandidat" : "Buat Kandidat"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-4">
            <Input
              placeholder="No Urut"
              type="number"
              value={form.no}
              onChange={(e) => setForm((s) => ({ ...s, no: e.target.value }))}
            />
            <Input
              placeholder="Slogan"
              value={form.slogan}
              onChange={(e) =>
                setForm((s) => ({ ...s, slogan: e.target.value }))
              }
            />
            <Input
              placeholder="Nama Ketua"
              value={form.ketuaNama}
              onChange={(e) =>
                setForm((s) => ({ ...s, ketuaNama: e.target.value }))
              }
            />
            <Input
              placeholder="Nama Wakil"
              value={form.wakilNama}
              onChange={(e) =>
                setForm((s) => ({ ...s, wakilNama: e.target.value }))
              }
            />
            <Input
              placeholder="Kelas Ketua"
              value={form.ketuaKelas}
              onChange={(e) =>
                setForm((s) => ({ ...s, ketuaKelas: e.target.value }))
              }
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((s) => ({ ...s, ketuaImg: e.target.files[0] }))
              }
            />
            <Input
              placeholder="Kelas Wakil"
              value={form.wakilKelas}
              onChange={(e) =>
                setForm((s) => ({ ...s, wakilKelas: e.target.value }))
              }
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((s) => ({ ...s, wakilImg: e.target.files[0] }))
              }
            />
            <textarea
              placeholder="Visi"
              className="col-span-2 border rounded-md p-2"
              value={form.visi}
              onChange={(e) => setForm((s) => ({ ...s, visi: e.target.value }))}
            />
            <textarea
              placeholder="Misi"
              className="col-span-2 border rounded-md p-2"
              value={form.misi}
              onChange={(e) => setForm((s) => ({ ...s, misi: e.target.value }))}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Upload 2 Foto Jurusan
              </label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((s) => ({ ...s, jurusanImg1: e.target.files[0] }))
                  }
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((s) => ({ ...s, jurusanImg2: e.target.files[0] }))
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Wajib upload 2 foto jurusan (misal logo PPLG & logo TJKT).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button onClick={onSave}>{editing ? "Simpan" : "Buat"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
