import { Capabilities } from "@/components/sections/capabilities";
import { CaseStudy } from "@/components/sections/case-study";
import { ContentPipeline } from "@/components/sections/content-pipeline";
import { Ecosystem } from "@/components/sections/ecosystem";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Monetization } from "@/components/sections/monetization";
import { Roadmap } from "@/components/sections/roadmap";
import {
  type CompanyFundamentals,
  companyFundamentals,
  FEATURED_CODES,
} from "@/lib/data/fundamentals";

export default function HomePage() {
  const companies = FEATURED_CODES.map(companyFundamentals).filter(
    (c): c is CompanyFundamentals => c !== null,
  );

  return (
    <>
      <Hero companies={companies} />
      <Capabilities />
      <HowItWorks />
      <Ecosystem />
      <Monetization />
      <Roadmap />
      <ContentPipeline />
      <CaseStudy />
      <FinalCta />
    </>
  );
}
