import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { savedItemsStore } from "@/store/savedItems";
import { mockUniversities } from "@/data/mock/universities";
import { mockCourses } from "@/data/mock/courses";
import { Bookmark, GraduationCap, MapPin, Heart, Trash2, Send, Compass, ArrowRight, ExternalLink } from "lucide-react";

export default function Saved() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const savedUnis = savedItemsStore.getSavedUniversities();
  const savedCourses = savedItemsStore.getSavedCourses();

  const savedUniversityDetails = savedUnis
    .map((s) => mockUniversities.find((u) => u.id === s.universityId))
    .filter(Boolean) as typeof mockUniversities;

  const savedCourseDetails = savedCourses
    .map((s) => {
      const course = mockCourses.find((c) => c.id === s.courseId);
      const uni = mockUniversities.find((u) => u.id === s.universityId);
      return course && uni ? { ...course, universityName: uni.name, universityCountry: uni.country } : null;
    })
    .filter(Boolean) as (typeof mockCourses[number] & { universityName: string; universityCountry: string })[];

  const handleRemoveUni = (uniId: number) => {
    savedItemsStore.removeUniversity(uniId);
    setRefreshKey((k) => k + 1);
  };

  const handleRemoveCourse = (courseId: number) => {
    savedItemsStore.removeCourse(courseId);
    setRefreshKey((k) => k + 1);
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-8 h-8 text-[#E08D3C]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3539]">Saved Items</h1>
        </div>
        <p className="text-muted-foreground">
          Your bookmarked universities and courses
        </p>
      </div>

      <Tabs defaultValue="universities" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="universities" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Universities ({savedUnis.length})
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Courses ({savedCourses.length})
          </TabsTrigger>
        </TabsList>

        {/* Universities Tab */}
        <TabsContent value="universities">
          {savedUniversityDetails.length === 0 ? (
            <Card className="p-10 text-center bg-white/70 backdrop-blur-sm border-2 border-gray-200/80">
              <Bookmark className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2C3539] mb-2">No Saved Universities</h3>
              <p className="text-muted-foreground mb-4">
                Explore universities and save the ones you're interested in.
              </p>
              <Button onClick={() => navigate("/discover")} className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white">
                <Compass className="w-4 h-4 mr-2" /> Discover Universities
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedUniversityDetails.map((uni) => (
                <Card
                  key={uni.id}
                  className="p-5 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center border flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-[#2C3539]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#2C3539] text-sm">{uni.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {uni.city}, {uni.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveUni(uni.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Badge className="text-[10px] bg-[#C4DFF0]/20 text-[#2C3539] border-0">
                      QS #{uni.qsRanking}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">{uni.type}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{uni.description}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-lg text-xs"
                      onClick={() => window.open(uni.website, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" /> Website
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-lg text-xs"
                      onClick={() => navigate("/discover")}
                    >
                      <Send className="w-3 h-3 mr-1" /> Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          {savedCourseDetails.length === 0 ? (
            <Card className="p-10 text-center bg-white/70 backdrop-blur-sm border-2 border-gray-200/80">
              <Bookmark className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2C3539] mb-2">No Saved Courses</h3>
              <p className="text-muted-foreground mb-4">
                Browse university courses and save your favorites.
              </p>
              <Button onClick={() => navigate("/discover")} className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white">
                <Compass className="w-4 h-4 mr-2" /> Discover Courses
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedCourseDetails.map((course) => (
                <Card
                  key={course.id}
                  className="p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2C3539] text-sm">{course.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{course.universityName}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{course.universityCountry}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{course.degreeLevel}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{course.duration}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{course.language}</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCourse(course.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 ml-3"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
