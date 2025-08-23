"use client";

import { useForm } from "react-hook-form";

export default function UpdateProfileForm({ profile, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      location: profile?.location || "",
      experience: profile?.experience || "",
      license: profile?.license || "",
    },
  });

  const onSubmit = (data) => {
    console.log("Updated Profile:", data);
    // TODO: call API to patch profile
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          {...register("name", { required: true })}
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">Name is required</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          {...register("phone")}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          {...register("location")}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Experience (Years)</label>
        <input
          type="number"
          {...register("experience")}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">License No.</label>
        <input
          {...register("license")}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
