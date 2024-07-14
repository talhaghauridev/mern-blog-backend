type AddComment = {
  input: {
    blog_id: string;
    comment: string;
    blog_author: string;
    replying_to: string;
    notification_id: string;
  };
};

export type { AddComment };
