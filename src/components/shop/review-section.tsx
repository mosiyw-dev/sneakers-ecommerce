"use client";

import * as React from "react";
import Image from "next/image";
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus } from "lucide-react";
import { ProductReview } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
  productName: string;
}

export function ReviewSection({
  reviews: initialReviews,
  rating,
  reviewCount,
  productName,
}: ReviewSectionProps) {
  const [reviews, setReviews] = React.useState<ProductReview[]>(initialReviews);
  const [writeModalOpen, setWriteModalOpen] = React.useState(false);
  const [newRating, setNewRating] = React.useState(5);
  const [authorName, setAuthorName] = React.useState("");
  const [reviewTitle, setReviewTitle] = React.useState("");
  const [reviewComment, setReviewComment] = React.useState("");
  const [helpfulCounts, setHelpfulCounts] = React.useState<Record<string, number>>({});

  const handleHelpful = (reviewId: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    toast.success("ممنون از بازخورد شما", "نظر شما به عنوان مفید ثبت شد.");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) {
      toast.warning("اطلاعات ناقص است", "لطفاً نام و متن نظر خود را وارد نمایید.");
      return;
    }

    const newReviewItem: ProductReview = {
      id: `user-rev-${Date.now()}`,
      author: authorName.trim(),
      rating: newRating,
      title: reviewTitle.trim() || "تجربه خرید عالی",
      comment: reviewComment.trim(),
      date: "لحظاتی پیش",
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    setReviews((prev) => [newReviewItem, ...prev]);
    toast.success(
      "دیدگاه شما با موفقیت ثبت شد",
      "نظر شما پس از بررسی کارشناس نمایش داده شد."
    );

    setAuthorName("");
    setReviewTitle("");
    setReviewComment("");
    setWriteModalOpen(false);
  };

  // Star breakdown calculation
  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <section className="space-y-8 pt-10 border-t border-border text-right" aria-label="نظرات خریداران">
      {/* Header with aggregate score & write CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            نظرات و بازخوردها
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            تجربه خریداران این مدل
          </h3>
        </div>

        <Button
          onClick={() => setWriteModalOpen(true)}
          className="gap-2 rounded-xl text-xs font-bold shadow-md self-start sm:self-auto"
        >
          <MessageSquarePlus className="h-4 w-4" />
          ثبت دیدگاه خریدار
        </Button>
      </div>

      {/* Aggregate Score & Distribution breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 items-center">
        <div className="md:col-span-4 text-center md:border-l md:border-border/80 md:pl-8 space-y-2">
          <span className="text-5xl font-black text-foreground font-mono">
            {rating.toFixed(1)}
          </span>
          <div className="flex justify-center items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5 fill-current",
                  i < Math.floor(rating) ? "text-amber-500" : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            بر اساس {reviewCount} دیدگاه ثبت‌شده خریداران
          </p>
        </div>

        {/* Progress Bars */}
        <div className="md:col-span-8 space-y-2">
          {starCounts.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-xs">
              <span className="w-14 text-muted-foreground font-mono">
                {row.stars} ستاره
              </span>
              <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="w-8 text-left text-muted-foreground font-mono">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 transition-all hover:border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted border border-border">
                  {rev.avatar ? (
                    <Image
                      src={rev.avatar}
                      alt={rev.author}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold text-xs">
                      {rev.author.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {rev.author}
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                        <ShieldCheck className="h-3 w-3" /> خریدار تأییدشده
                      </span>
                    )}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold text-foreground">{rev.title}</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {rev.comment}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleHelpful(rev.id)}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ThumbsUp className="h-3 w-3" />
                <span>
                  مفید بود ({(rev.helpfulCount || 0) + (helpfulCounts[rev.id] || 0)})
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      <Dialog open={writeModalOpen} onOpenChange={setWriteModalOpen} maxWidth="md">
        <DialogHeader onClose={() => setWriteModalOpen(false)}>
          <DialogTitle>ثبت نظر درباره {productName}</DialogTitle>
        </DialogHeader>

        <DialogContent className="p-6 text-right">
          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                امتیاز شما به این مدل:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        star <= newRating ? "fill-current" : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                نام و نام خانوادگی:
              </label>
              <Input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="مثلاً علی علوی"
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                عنوان نظر:
              </label>
              <Input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="مثلاً کیفیت چرم عالی و راحتی فوق‌العاده"
                className="text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                متن نقد و تجربه استفاده:
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="درباره فیت بودن سایز پا، راحتی کپسول هوا، کیفیت جعبه و بسته‌بندی بنویسید..."
                className="w-full h-24 rounded-xl border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl text-xs font-bold shadow-md"
            >
              ارسال و ثبت نهایی دیدگاه
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
