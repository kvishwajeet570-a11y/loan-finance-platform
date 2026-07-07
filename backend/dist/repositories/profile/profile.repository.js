"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRepository = void 0;
const prisma_1 = require("../../prisma");
class ProfileRepository {
    /* =========================
        GET PROFILE
    ========================= */
    static async getProfile(userId) {
        return prisma_1.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                profileImage: true,
                gender: true,
                dob: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                isVerified: true,
                createdAt: true
            }
        });
    }
    /* =========================
        UPDATE PROFILE
    ========================= */
    static async updateProfile(userId, data) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data
        });
    }
    /* =========================
        UPDATE PROFILE IMAGE
    ========================= */
    static async updateProfileImage(userId, profileImage) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profileImage
            }
        });
    }
    /* =========================
        REMOVE PROFILE IMAGE
    ========================= */
    static async removeProfileImage(userId) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profileImage: null
            }
        });
    }
    /* =========================
        UPDATE ADDRESS
    ========================= */
    static async updateAddress(userId, address, city, state, pincode) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                address,
                city,
                state,
                pincode
            }
        });
    }
    /* =========================
        CHANGE EMAIL
    ========================= */
    static async updateEmail(userId, email) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                email
            }
        });
    }
    /* =========================
        CHANGE PHONE
    ========================= */
    static async updatePhone(userId, phoneNo) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                phoneNo
            }
        });
    }
    /* =========================
        PROFILE COMPLETION
    ========================= */
    static async getProfileCompletion(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return 0;
        }
        const fields = [
            user.name,
            user.email,
            user.phoneNo,
            user.profileImage,
            user.gender,
            user.dob,
            user.address,
            user.city,
            user.state,
            user.pincode
        ];
        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    }
    /* =========================
        PROFILE SUMMARY
    ========================= */
    static async getProfileSummary(userId) {
        const [user, totalLoans, totalDocuments, totalNotifications] = await Promise.all([
            prisma_1.prisma.user.findUnique({
                where: {
                    id: userId
                }
            }),
            prisma_1.prisma.loanApplication.count({
                where: {
                    userId
                }
            }),
            prisma_1.prisma.document.count({
                where: {
                    userId
                }
            }),
            prisma_1.prisma.notification.count({
                where: {
                    userId
                }
            })
        ]);
        return {
            user,
            totalLoans,
            totalDocuments,
            totalNotifications
        };
    }
    /* =========================
        ACCOUNT STATUS
    ========================= */
    static async getAccountStatus(userId) {
        return prisma_1.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                isVerified: true,
                isBlocked: true,
                role: true,
                createdAt: true
            }
        });
    }
    /* =========================
        DELETE ACCOUNT
    ========================= */
    static async deleteProfile(userId) {
        return prisma_1.prisma.user.delete({
            where: {
                id: userId
            }
        });
    }
    /* =========================
        PROFILE DASHBOARD
    ========================= */
    static async getDashboard(userId) {
        const [profile, loanCount, approvedLoans, pendingLoans, unreadNotifications] = await Promise.all([
            this.getProfile(userId),
            prisma_1.prisma.loanApplication.count({
                where: { userId }
            }),
            prisma_1.prisma.loanApplication.count({
                where: {
                    userId,
                    status: "APPROVED"
                }
            }),
            prisma_1.prisma.loanApplication.count({
                where: {
                    userId,
                    status: "PENDING"
                }
            }),
            prisma_1.prisma.notification.count({
                where: {
                    userId,
                    isRead: false
                }
            })
        ]);
        return {
            profile,
            loanCount,
            approvedLoans,
            pendingLoans,
            unreadNotifications
        };
    }
}
exports.ProfileRepository = ProfileRepository;
