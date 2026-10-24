import sys
import types
import importlib.util
import unittest

# This test file is dependency-light so the scoring logic can be regression-tested
# without making network requests.

flask = types.ModuleType("flask")
class DummyApp:
    config = {}
    def route(self, *args, **kwargs):
        return lambda fn: fn
    def errorhandler(self, *args, **kwargs):
        return lambda fn: fn
flask.Flask = lambda *args, **kwargs: DummyApp()
flask.request = types.SimpleNamespace()
flask.jsonify = lambda value: value
sys.modules["flask"] = flask

cors = types.ModuleType("flask_cors")
cors.CORS = lambda *args, **kwargs: None
sys.modules["flask_cors"] = cors

requests = types.ModuleType("requests")
requests.get = lambda *args, **kwargs: None
requests.post = lambda *args, **kwargs: None
requests.RequestException = Exception
sys.modules["requests"] = requests

pypdf = types.ModuleType("PyPDF2")
pypdf.PdfReader = None
sys.modules["PyPDF2"] = pypdf

docx = types.ModuleType("docx")
docx.Document = None
sys.modules["docx"] = docx

spec = importlib.util.spec_from_file_location("skillsync_app", "app.py")
app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app)


RESUME = """Srijali Srivastava
Prayagraj, Uttar Pradesh | +91 9026382889 | srijali2329@gmail.com
LinkedIn: linkedin.com/in/SrijaliSrivastava
CAREER OBJECTIVE
Dedicated and detail-oriented B.Tech Computer Science (Artificial Intelligence) student with a strong academic background and hands-on experience in programming and data analysis.
EDUCATION
Bachelor of Technology (B.Tech) – Computer Science & Engineering (Artificial Intelligence)
CGPA: 8.65
TECHNICAL SKILLS
Programming Languages: C, Python, C++
AI / Data Tools: NumPy, Pandas
Web Technologies: HTML, CSS
Core Subjects: Data Structures & Algorithms, DBMS
PROJECTS
CredShield – AI Password Checker & Email Risk Advisor
Developed an AI-assisted system using Python, AI concepts and Data Analysis.
CERTIFICATIONS
Python Programming – Infosys Springboard
CSS Certification – Infosys Springboard
JavaScript Certification – Infosys Springboard
SOFT SKILLS
Problem-solving, Analytical thinking, Time management, Team collaboration
DECLARATION
I hereby declare that the information provided above is true and correct.
"""


class ResumeAnalysisTests(unittest.TestCase):
    def test_experience_keyword_in_objective_is_not_experience(self):
        result = app.score_resume_quality(RESUME)
        self.assertFalse(result["sections"]["experience"])
        experience = next(x for x in result["breakdown"] if x["category"] == "Experience / Internship")
        self.assertEqual(experience["score"], 0)

    def test_real_sections_are_detected(self):
        result = app.score_resume_quality(RESUME)
        sections = result["sections"]
        self.assertTrue(sections["education"])
        self.assertTrue(sections["skills"])
        self.assertTrue(sections["projects"])
        self.assertTrue(sections["certifications"])
        self.assertTrue(sections["summary"])
        self.assertTrue(sections["contact"])

    def test_role_score_changes_by_role(self):
        software = app.role_skill_analysis(RESUME, "Software Engineer")
        frontend = app.role_skill_analysis(RESUME, "Frontend Developer")
        self.assertEqual(software["match_percentage"], 60.0)
        self.assertEqual(frontend["match_percentage"], 40.0)

    def test_readiness_uses_fixed_100_point_model(self):
        readiness = app.calculate_readiness(13.4, 10, True, 5, True, 60)
        self.assertEqual(readiness["overall_score"], 52.4)
        self.assertEqual(sum(c["max_score"] for c in readiness["components"]), 100)


if __name__ == "__main__":
    unittest.main()
