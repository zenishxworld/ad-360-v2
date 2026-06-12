import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { mockUniversities, University } from "@/data/mock/universities";
import { mockCourses, Course } from "@/data/mock/courses";
import { savedItemsStore } from "@/store/savedItems";
import { applicationStore } from "@/store/applications";
import { Search, MapPin, GraduationCap, Bookmark, Heart, ArrowRight, Filter, X, Send, ExternalLink } from "lucide-react";

const COUNTRIES = [...new Set(mockUniversities.map((u) => u.country))].sort();
const DEGREES = ["Bachelor", "Master", "PhD"];
const FIELDS = [...new Set(mockCourses.map((c) => c.fieldOfStudy))].sort();

export default function Discover() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const toggleCountry = (c: string) =>
    setSelectedCountries((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  const toggleDegree = (d: string) =>
    setSelectedDegrees((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);
  const toggleField = (f: string) =>
    setSelectedFields((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f]);

  const clearAll = () => {
    setSelectedCountries([]);
    setSelectedDegrees([]);
    setSelectedFields([]);
    setSearch("");
  };

  const hasFilters = selectedCountries.length > 0 || selectedDegrees.length > 0 || selectedFields.length > 0;

  const filtered = useMemo(() => {
    return mockUniversities.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(u.country)) return false;
      if (selectedDegrees.length > 0 && !selectedDegrees.some((d) => u.degreeLevels.includes(d))) return false;
      if (selectedFields.length > 0) {
        const uniCourses = mockCourses.filter((c) => c.universityId === u.id);
        if (!selectedFields.some((f) => uniCourses.some((c) => c.fieldOfStudy === f))) return false;
      }
      return true;
    });
  }, [search, selectedCountries, selectedDegrees, selectedFields]);

  const getUniCourses = (uniId: number) => mockCourses.filter((c) => c.universityId === uniId);

  const handleSaveUni = (uniId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    savedItemsStore.toggleUniversity(uniId);
  };

  const handleApply = (uni: University, course: Course) => {
    applicationStore.create({
      studentId: 1,
      studentName: "John Doe",
      universityId: uni.id,
      universityName: uni.name,
      courseId: course.id,
      courseName: course.name,
      country: uni.country,
      targetSemester: uni.intake[0] || "Fall 2025",
    });
    setShowDetail(false);
    navigate("/applications");
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3539] mb-2">Discover Universities</h1>
        <p className="text-muted-foreground">Explore {mockUniversities.length}+ universities across the world</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by university name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 rounded-2xl border-2 border-gray-200 text-base"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Countries */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Countries
          </p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleCountry(c)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  selectedCountries.includes(c)
                    ? "bg-[#E08D3C] text-white border-[#E08D3C]"
                    : "bg-white text-[#2C3539] border-gray-200 hover:border-gray-300"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Degree & Field in one row */}
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> Degree
            </p>
            <div className="flex gap-2">
              {DEGREES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDegree(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedDegrees.includes(d)
                      ? "bg-[#2C3539] text-white border-[#2C3539]"
                      : "bg-white text-[#2C3539] border-gray-200 hover:border-gray-300"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Field of Study</p>
            <div className="flex flex-wrap gap-2 max-w-xl">
              {FIELDS.slice(0, 8).map((f) => (
                <button
                  key={f}
                  onClick={() => toggleField(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedFields.includes(f)
                      ? "bg-[#C4DFF0] text-[#2C3539] border-[#C4DFF0]"
                      : "bg-white text-[#2C3539] border-gray-200 hover:border-gray-300"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">
            <X className="w-3 h-3 mr-1" /> Clear all filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-[#2C3539]">{filtered.length}</span> universities
      </p>

      {/* University Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((uni) => {
          const isSaved = savedItemsStore.isUniversitySaved(uni.id);
          return (
            <Card
              key={uni.id}
              className="p-5 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#C4DFF0]/50 transition-all cursor-pointer group"
              onClick={() => { setSelectedUni(uni); setShowDetail(true); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center border border-[#C4DFF0]/20 flex-shrink-0">
                    {uni.logoUrl ? (
                      <img src={uni.logoUrl} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-[#2C3539]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#2C3539] text-sm truncate">{uni.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {uni.city}, {uni.country}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleSaveUni(uni.id, e)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-all",
                      isSaved ? "fill-red-500 text-red-500" : "text-gray-300 group-hover:text-red-400"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {uni.country}
                </span>
                <span>QS #{uni.qsRanking}</span>
                <Badge className="text-[10px] bg-[#C4DFF0]/20 text-[#2C3539] border-0">
                  {uni.type}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{uni.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {uni.programs.slice(0, 3).map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">
                    {p}
                  </Badge>
                ))}
                {uni.programs.length > 3 && (
                  <Badge variant="outline" className="text-[10px]">+{uni.programs.length - 3}</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No universities match your filters.</p>
          <Button variant="outline" onClick={clearAll} className="mt-3">
            Clear Filters
          </Button>
        </div>
      )}

      {/* University Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedUni && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#2C3539] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C4DFF0]/30 to-white flex items-center justify-center border">
                    {selectedUni.logoUrl ? (
                      <img src={selectedUni.logoUrl} alt="" className="w-7 h-7 object-contain" />
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>
                  {selectedUni.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Key Info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">QS Ranking</p>
                    <p className="text-lg font-bold text-[#2C3539]">#{selectedUni.qsRanking}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Acceptance</p>
                    <p className="text-lg font-bold text-[#2C3539]">{selectedUni.acceptanceRate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tuition</p>
                    <p className="text-sm font-semibold text-[#2C3539] truncate">{selectedUni.tuitionFee}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{selectedUni.description}</p>

                {/* Courses */}
                <div>
                  <h4 className="font-semibold text-[#2C3539] mb-3 text-sm">Available Courses</h4>
                  <div className="space-y-2">
                    {getUniCourses(selectedUni.id).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-gray-200/60 hover:border-[#C4DFF0]/50 transition-all"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#2C3539]">{course.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.degreeLevel} · {course.duration} · {course.language}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-lg text-xs flex-shrink-0 ml-3"
                          onClick={() => handleApply(selectedUni, course)}
                        >
                          <Send className="w-3 h-3 mr-1" /> Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{selectedUni.city}, {selectedUni.state}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium">{selectedUni.language}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">Application Fee</span>
                    <span className="font-medium">{selectedUni.applicationFee}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">Intake</span>
                    <span className="font-medium">{selectedUni.intake.join(", ")}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedUni.website, "_blank")}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Website
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => savedItemsStore.toggleUniversity(selectedUni.id)}
                    className={savedItemsStore.isUniversitySaved(selectedUni.id) ? "text-red-500 border-red-200" : ""}
                  >
                    <Heart className={cn("w-3.5 h-3.5 mr-1", savedItemsStore.isUniversitySaved(selectedUni.id) && "fill-red-500")} />
                    {savedItemsStore.isUniversitySaved(selectedUni.id) ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
