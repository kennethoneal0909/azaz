import React, { useState, useEffect } from "react";
import { Phone, Calendar, DollarSign, CreditCard } from "lucide-react";
import { getAllMembers, Member } from "@/services/memberService";
import { formatDate, formatNumber } from "@/lib/utils";
import TopMobileNavigation from "../layout/TopMobileNavigation";
import MobileNavigationComponent from "../layout/MobileNavigation";

interface PendingPaymentsPageProps {
  onBack?: () => void;
}

const PendingPaymentsPage = ({ onBack }: PendingPaymentsPageProps) => {
  const [unpaidMembers, setUnpaidMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnpaidMembers = async () => {
      setLoading(true);
      try {
        const members = await getAllMembers();

        // Filter members with pending payments or expired subscriptions
        const unpaidMembersList = members.filter((member) => {
          const hasUnpaidStatus =
            member.paymentStatus === "unpaid" ||
            member.paymentStatus === "partial";
          const hasPendingMembership = member.membershipStatus === "pending";
          const hasZeroSessions =
            member.sessionsRemaining !== undefined &&
            member.sessionsRemaining === 0;

          // Check if subscription month has ended
          const hasExpiredSubscription = (() => {
            if (!member.membershipStartDate) return false;

            const startDate = new Date(member.membershipStartDate);
            const currentDate = new Date();

            // Calculate one month from start date
            const oneMonthLater = new Date(startDate);
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

            // Check if current date is past the one month mark
            return currentDate > oneMonthLater;
          })();

          return (
            hasUnpaidStatus ||
            hasPendingMembership ||
            hasZeroSessions ||
            hasExpiredSubscription
          );
        });

        setUnpaidMembers(unpaidMembersList);
      } catch (error) {
        console.error("Error fetching unpaid members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnpaidMembers();
  }, []);

  return (
    <>
      {/* Mobile Navigation */}
      <TopMobileNavigation activeItem="payments" setActiveItem={() => {}} />

      <div className="bg-gradient-to-br from-bluegray-900 via-bluegray-800 to-bluegray-900 fixed inset-0 text-white overflow-y-auto">
        <div className="container mx-auto px-3 sm:px-4 pt-20 pb-36 sm:pb-32 lg:pt-6 lg:pb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : unpaidMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-green-400 text-lg">لا توجد مدفوعات معلقة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unpaidMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-bluegray-800/50 backdrop-blur-xl border border-bluegray-700 rounded-lg p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">
                        {member.name}
                      </h3>
                      {member.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-400" />
                          <span className="text-white font-medium">
                            {member.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Subscription Price */}
                    {member.subscriptionPrice && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-400" />
                        <span className="text-green-300 text-sm font-semibold">
                          ثمن الاشتراك: {formatNumber(member.subscriptionPrice)}{" "}
                          دج
                        </span>
                      </div>
                    )}

                    {/* Subscription Type */}
                    {member.subscriptionType && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-400" />
                        <span className="text-purple-300 text-sm">
                          نوع الاشتراك: {member.subscriptionType}
                        </span>
                      </div>
                    )}

                    {member.membershipStartDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">
                          تاريخ الاشتراك:{" "}
                          {formatDate(member.membershipStartDate)}
                        </span>
                      </div>
                    )}

                    {/* Payment Status Badge */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.paymentStatus === "unpaid"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : member.paymentStatus === "partial"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {member.paymentStatus === "unpaid" && "غير مدفوع"}
                        {member.paymentStatus === "partial" && "مدفوع جزئياً"}
                        {member.paymentStatus === "paid" && "مدفوع"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigationComponent
        activeItem="payments"
        setActiveItem={(item) => {
          if (onBack) onBack();
        }}
        onTodayAttendanceClick={() => {
          if (onBack) onBack();
        }}
        onPendingPaymentsClick={() => {}}
      />
    </>
  );
};

export default PendingPaymentsPage;
