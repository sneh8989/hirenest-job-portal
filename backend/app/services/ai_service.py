from typing import List, Dict, Any, Optional
import math
from app.core.config import settings

class AIService:
    @staticmethod
    def normalize_skill(skill: str) -> str:
        return skill.strip().lower()

    @classmethod
    def calculate_match_score(
        cls,
        applicant_skills: List[str],
        required_skills: List[str],
        preferred_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Deterministic, transparent skill matching baseline:
        - Required skills weight: 70%
        - Preferred skills weight: 30%
        """
        user_skills_set = {cls.normalize_skill(s) for s in applicant_skills if s}
        req_skills_set = {cls.normalize_skill(s) for s in required_skills if s}
        pref_skills_set = {cls.normalize_skill(s) for s in preferred_skills if s}

        matching_required = [s for s in required_skills if cls.normalize_skill(s) in user_skills_set]
        missing_required = [s for s in required_skills if cls.normalize_skill(s) not in user_skills_set]

        matching_preferred = [s for s in preferred_skills if cls.normalize_skill(s) in user_skills_set]
        missing_preferred = [s for s in preferred_skills if cls.normalize_skill(s) not in user_skills_set]

        req_score = 1.0
        if req_skills_set:
            req_score = len(matching_required) / len(req_skills_set)

        pref_score = 1.0
        if pref_skills_set:
            pref_score = len(matching_preferred) / len(pref_skills_set)

        # Base composite score
        composite_score = (req_score * 70.0) + (pref_score * 30.0)
        # Round to 1 decimal place
        composite_score = round(min(100.0, max(15.0, composite_score)), 1)

        # Rating Category
        if composite_score >= 85:
            rating_category = "High Match"
            fit_summary = "Candidate demonstrates strong alignment with both core and preferred technical competencies."
        elif composite_score >= 70:
            rating_category = "Strong Candidate"
            fit_summary = "Candidate satisfies majority of essential requirements with minor gaps in secondary tooling."
        elif composite_score >= 50:
            rating_category = "Moderate Match"
            fit_summary = "Candidate covers fundamental prerequisites but would benefit from targeted ramp-up."
        else:
            rating_category = "Potential Fit"
            fit_summary = "Candidate possesses foundational aptitude; development in key stack technologies required."

        next_steps = []
        if missing_required:
            next_steps.append(f"Review core requirements: {', '.join(missing_required[:3])}")
        if missing_preferred:
            next_steps.append(f"Familiarize with preferred tooling: {', '.join(missing_preferred[:2])}")
        next_steps.append("Tailor project portfolio to demonstrate applied experience in the matching skills.")

        return {
            "match_score": composite_score,
            "rating_category": rating_category,
            "matching_skills": list(dict.fromkeys(matching_required + matching_preferred)),
            "missing_required_skills": missing_required,
            "missing_preferred_skills": missing_preferred,
            "explanation": fit_summary,
            "suggested_next_steps": next_steps,
            "is_ai_generated": True,
            "provider": f"{settings.AI_PROVIDER} (Rule-Based Deterministic Engine)"
        }

    @classmethod
    def generate_skill_gap_analysis(cls, job, applicant_profile) -> Dict[str, Any]:
        """
        Analyzes the delta between applicant skills and job requirements.
        Generates actionable, prioritized learning paths.
        """
        user_skills = applicant_profile.skills if applicant_profile and applicant_profile.skills else []
        req_skills = job.skills_required or []
        pref_skills = job.skills_preferred or []

        user_skills_set = {cls.normalize_skill(s) for s in user_skills}

        skills_possessed = [s for s in (req_skills + pref_skills) if cls.normalize_skill(s) in user_skills_set]
        # remove duplicates
        skills_possessed = list(dict.fromkeys(skills_possessed))

        skills_to_acquire = [s for s in (req_skills + pref_skills) if cls.normalize_skill(s) not in user_skills_set]
        skills_to_acquire = list(dict.fromkeys(skills_to_acquire))

        total_tracked = len(req_skills) + len(pref_skills)
        if total_tracked > 0:
            pct = round((len(skills_possessed) / total_tracked) * 100, 1)
        else:
            pct = 100.0

        # Build learning roadmap
        roadmap = []
        for s in skills_to_acquire:
            is_req = any(cls.normalize_skill(s) == cls.normalize_skill(r) for r in req_skills)
            priority = "High" if is_req else "Medium"
            roadmap.append({
                "skill": s,
                "priority": priority,
                "learning_resources": [
                    f"Official {s} Documentation and Quickstarts",
                    f"Interactive Real-world Project Labs for {s}",
                    f"Production Architecture Deep Dive in {s}"
                ],
                "recommended_project": f"Build an end-to-end service or micro-feature implementing {s} with unit and integration tests."
            })

        # Estimated time to readiness
        weeks_needed = max(1, math.ceil(len(skills_to_acquire) * 1.5))
        estimated_time = f"{weeks_needed} - {weeks_needed + 2} weeks of dedicated practice" if skills_to_acquire else "Ready to interview immediately"

        return {
            "job_title": job.title,
            "company_name": job.company.name if job.company else "Hiring Company",
            "overall_match_percentage": pct,
            "skills_possessed": skills_possessed,
            "skills_to_acquire": skills_to_acquire,
            "learning_roadmap": roadmap,
            "estimated_time_to_ready": estimated_time,
            "provider": f"{settings.AI_PROVIDER} (Curated Skill Ontology)"
        }

    @classmethod
    def recommend_jobs(cls, applicant_profile, jobs: List[Any], limit: int = 6) -> List[Dict[str, Any]]:
        """
        Recommends top jobs based on skills overlap and preferred employment type / location.
        """
        user_skills = applicant_profile.skills if applicant_profile and applicant_profile.skills else []
        preferred_type = (applicant_profile.preferred_employment_type or "").lower() if applicant_profile else ""
        preferred_loc = (applicant_profile.preferred_location or "").lower() if applicant_profile else ""

        scored_jobs = []
        for job in jobs:
            match_data = cls.calculate_match_score(
                user_skills,
                job.skills_required or [],
                job.skills_preferred or []
            )
            score = match_data["match_score"]

            # Small bonus for matching preferences
            if preferred_type and preferred_type in job.employment_type.lower():
                score += 5.0
            if preferred_loc and (preferred_loc in job.location.lower() or job.work_arrangement.lower() == "remote"):
                score += 5.0

            score = min(100.0, score)
            scored_jobs.append({
                "job": job,
                "score": score,
                "reason": f"Matches {len(match_data['matching_skills'])} of your recorded skills."
            })

        # Sort descending by score
        scored_jobs.sort(key=lambda x: x["score"], reverse=True)
        return scored_jobs[:limit]
