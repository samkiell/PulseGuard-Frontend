import { BookOpen, ExternalLink } from 'lucide-react';
import type { Violation } from './ViolationFeed';

interface RegulatoryPanelProps {
  selectedViolation: Violation | null;
}

const regulatoryContext: Record<string, {
  fullCitation: string;
  excerpt: string;
  context: string;
}> = {
  'HIPAA § 164.508': {
    fullCitation: '45 CFR § 164.508 - Uses and disclosures for which an authorization is required',
    excerpt: '(a) Standard: Authorizations for uses and disclosures. (1) Authorization required: General rule. Except as otherwise permitted or required by this subchapter, a covered entity may not use or disclose protected health information without an authorization that is valid under this section.',
    context: 'This provision requires written authorization from patients before their PHI can be used or disclosed, except in specific circumstances. The authorization must be properly executed with all required elements including signature, date, and expiration.',
  },
  'HIPAA § 164.312(e)(1)': {
    fullCitation: '45 CFR § 164.312(e)(1) - Technical safeguards: Transmission security',
    excerpt: '(e)(1) Transmission security (Addressable). Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.',
    context: 'Covered entities must implement encryption or equivalent alternative measures when transmitting ePHI over electronic networks. This includes email, web portals, and any network-based PHI exchange.',
  },
  'HIPAA § 164.502(b)': {
    fullCitation: '45 CFR § 164.502(b) - Minimum necessary requirements',
    excerpt: '(b) Standard: Minimum necessary. (1) Minimum necessary applies. When using or disclosing protected health information or when requesting protected health information from another covered entity, a covered entity must make reasonable efforts to limit protected health information to the minimum necessary to accomplish the intended purpose of the use, disclosure, or request.',
    context: 'The minimum necessary standard requires covered entities to evaluate their practices and enhance safeguards to limit unnecessary access to PHI. Disclosures must be justified as the minimum amount needed for the stated purpose.',
  },
  'HIPAA § 164.308(b)(1)': {
    fullCitation: '45 CFR § 164.308(b)(1) - Business associate contracts and other arrangements',
    excerpt: '(b)(1) Business associate contracts or other arrangements. A covered entity may permit a business associate to create, receive, maintain, or transmit electronic protected health information on the covered entity\'s behalf only if the covered entity obtains satisfactory assurances that the business associate will appropriately safeguard the information.',
    context: 'Before any third-party vendor can access PHI, a Business Associate Agreement (BAA) must be executed. The BAA must specify permitted uses, require safeguards, and mandate breach notification.',
  },
  'HIPAA § 164.520': {
    fullCitation: '45 CFR § 164.520 - Notice of privacy practices for protected health information',
    excerpt: '(b)(1)(v) A statement that the covered entity reserves the right to change the terms of its notice and to make the new notice provisions effective for all protected health information that it maintains.',
    context: 'Privacy notices must be current and properly versioned. When substantive changes are made, covered entities must redistribute the updated notice and maintain documentation of distribution.',
  },
};

export function RegulatoryPanel({ selectedViolation }: RegulatoryPanelProps) {
  if (!selectedViolation) {
    return (
      <div className="h-full flex flex-col bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden backdrop-blur-sm bg-opacity-80">
        <div className="px-4 py-3 border-b border-[#30363D]">
          <div className="text-sm text-[#E5E7EB] font-mono">Regulatory Evidence</div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
            <div className="text-sm text-[#9CA3AF] font-mono">
              Select a violation to view<br />regulatory context
            </div>
          </div>
        </div>
      </div>
    );
  }

  const context = regulatoryContext[selectedViolation.citation];

  return (
    <div className="h-full flex flex-col bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden backdrop-blur-sm bg-opacity-80">
      <div className="px-4 py-3 border-b border-[#30363D] flex items-center justify-between">
        <div className="text-sm text-[#E5E7EB] font-mono">Regulatory Evidence</div>
        <div className="text-[10px] text-[#00D1FF] font-mono bg-[#00D1FF] bg-opacity-10 px-2 py-1 rounded border border-[#00D1FF]">
          RAG
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <div className="text-xs text-[#9CA3AF] mb-2 font-mono uppercase">Citation</div>
          <div className="text-sm text-[#00D1FF] font-mono bg-[#00D1FF] bg-opacity-5 px-3 py-2 rounded border border-[#00D1FF] border-opacity-30">
            {context.fullCitation}
          </div>
        </div>

        <div>
          <div className="text-xs text-[#9CA3AF] mb-2 font-mono uppercase">Statutory Text</div>
          <div className="text-sm text-[#E5E7EB] leading-relaxed p-4 bg-[#0B0E14] rounded border border-[#30363D] font-mono">
            {context.excerpt}
          </div>
        </div>

        <div>
          <div className="text-xs text-[#9CA3AF] mb-2 font-mono uppercase">Compliance Context</div>
          <div className="text-sm text-[#E5E7EB] leading-relaxed">
            {context.context}
          </div>
        </div>

        <div className="pt-4 border-t border-[#30363D]">
          <button className="flex items-center gap-2 text-xs text-[#00D1FF] hover:text-[#2EB872] transition-colors font-mono">
            <ExternalLink className="w-3.5 h-3.5" />
            View Full Regulation
          </button>
        </div>
      </div>
    </div>
  );
}
