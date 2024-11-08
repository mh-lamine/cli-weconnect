import { getInitials } from "@/utils/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function MemberCard({ member, timeSlotSelected, selectedMember, setSelectedMember }) {
  const { memberId, memberName, availableSlots } = member;
  const isAvailable = availableSlots.some(
    (slot) => slot.start === timeSlotSelected
  );

  if (isAvailable) {
    return (
      <Button
        variant={selectedMember == memberId ? "default" : "outline"}
        className="w-fit h-fit"
        onClick={() => selectedMember == memberId ? setSelectedMember() : setSelectedMember(memberId)}
      >
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={member.profilePicture} />
            <AvatarFallback className="text-md">
              {memberName && getInitials(memberName)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="text-lg font-medium">{memberName}</p>
          </div>
        </div>
      </Button>
    );
  }
}
