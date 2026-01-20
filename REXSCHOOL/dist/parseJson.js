/*
REXSchool Copyright (C) 2026 Lorendos aka Leonid
Full license agrement is under the file LICENSE
Uses code from AdriDevelopsThings/xschool-node on github
*/
export const parseJSON = (json) => {
  const terms = []
  for (const term of json.Terms) {
    const outTerm = { id: term.Id, title: term.Title, current: term.IsCurrent }
    const students = json.Students.filter((s) => s.TermId == term.Id)
    outTerm['students'] = students.map((student) => ({
      id: student.Id,
      firstname: student.Firstname,
      lastname: student.Lastname,
      subjects: student.Subjects.map((subject) => ({
        id: subject.Id,
        title: subject.Title,
        marks: subject.Ratings.map((rating) => ({
          id: rating.ColumnId,
          title: rating.Title,
          dateOfCorrection: rating.DateOfCorrection,
          dateOfRating: rating.DateOfRating,
          mark: rating.MarkValue ? +rating.MarkValue : null,
        })),
      })),
    }))
    terms.push(outTerm)
  }
  return terms
}
