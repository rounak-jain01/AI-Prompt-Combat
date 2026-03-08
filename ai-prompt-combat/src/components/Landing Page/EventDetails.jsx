import React from "react";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Phone, UserCheck, Shield } from "lucide-react";

const studentCoordinators = [
  { name: "Vipin Tomar", position: "President", number: "9238419902" },
  { name: "Devansh Mishra", position: "Discipline Lead", number: "7974649071" },
  { name: "Aishwarya Kumar", position: "Student Coordinator", number: "7509222172" },
  { name: "Arjit Tripathi", position: "Student Coordinator", number: "9755761897" },
];

const facultyCoordinators = [
  { name: "Ms. Madhuri Walia", role: "Kalasarthi Faculty Coordinator" },
  { name: "Ms. Ruchi Jain", role: "Kaggle Koders Faculty Coordinator" },
];

const rules = [
  "All activities (countdowns, tasks, submissions) must be done through the official Competition Web Portal.",
  "Individual participation only. Teamwork is prohibited.",
  "Submissions must be uploaded before the synchronized timer locks the gates.",
  "Pre-generated content, plagiarism, or portal manipulation leads to immediate permanent ban.",
  "Leaderboard standings and judging panel evaluation are final and binding.",
];

const EventDetails = () => {
  return (
    <section id="details" className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[180px] opacity-5 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            Event Info
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Venue, Coordinators & <span className="text-primary">Rules</span>
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Venue */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors min-h-[140px]"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white mb-2">Venue</h3>
                  <p className="text-gray-400 leading-relaxed">
                    AIDS AV Hall, Lab 3 (First Floor), Lab 4–5 (Second Floor)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Entry Fee */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors min-h-[140px]"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <IndianRupee size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white mb-2">Entry Fee</h3>
                  <p className="text-gray-400">₹199/-</p>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Faculty Coordinators */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors min-h-[140px]"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <UserCheck size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1">Faculty Coordinators</h3>
                  <p className="text-gray-500 text-sm mb-4">Guiding the event and mentoring participants</p>
                  <div className="space-y-3">
                    {facultyCoordinators.map((person, i) => (
                      <div key={i} className="py-2 border-b border-white/5 last:border-b-0 group">
                        <p className="text-white font-semibold leading-tight transition-colors duration-200 group-hover:text-primary">{person.name}</p>
                        <p className="text-gray-500 text-sm mt-0.5">{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Student Coordinators – table-style layout */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors min-h-[140px]"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="text-lg font-bold text-white mb-3">Student Coordinators</h3>
                  <div className="space-y-3">
                    {studentCoordinators.map((c, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-start gap-4 py-2 border-b border-white/5 last:border-b-0 group"
                      >
                        <div className="min-w-0">
                          <p className="text-white font-semibold leading-tight transition-colors duration-200 group-hover:text-primary">{c.name}</p>
                          <p className="text-gray-500 text-sm mt-0.5">{c.position}</p>
                        </div>
                        <a
                          href={`tel:${c.number}`}
                          className="text-primary font-mono text-sm hover:underline shrink-0"
                        >
                          {c.number}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Rules – full width, aligned with grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white mb-3">Event Rules & Regulations</h3>
                <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                  {rules.map((rule, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary shrink-0">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;