"use client";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlinePerson } from "react-icons/md";
import Modal from "@/components/Modal/page";
import supabase from "@/config/supabaseClient";
import { z } from "zod";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    membership: "",
    id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Anda belum login");
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("id, full_name, email, phone_number, membership")
        .eq("id", user.id)
        .single();
      if (fetchError || !data) {
        setError("Gagal mengambil data profil.");
        setLoading(false);
        return;
      }
      setUserData(data);
      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        membership: data.membership || "VIP",
        id: data.id || "",
      });
      setLoading(false);
    };
    fetchUser();
  }, []);

  const buttonEdit = () => {
    setEditMode(true);
    console.log("Edit mode set to true");
  };
  const onCancel = () => setShowModal(true);
  const onModalCancel = () => setShowModal(false);
  const onModalConfirm = () => {
    setForm({
      full_name: userData.full_name || "",
      email: userData.email || "",
      phone_number: userData.phone_number || "",
      membership: userData.membership || "VIP",
      id: userData.id || "",
    });
    setEditMode(false);
    setShowModal(false);
  };
  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onSave = async () => {
    const result = formSchema.safeParse({
      full_name: form.full_name,
      phone_number: form.phone_number,
    });
    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setSaving(true);
    const { error: updateError } = await supabase
      .from("users")
      .update({
        full_name: form.full_name,
        phone_number: form.phone_number,
      })
      .eq("id", form.id);
    setSaving(false);
    if (updateError) {
      setError("Gagal menyimpan perubahan.");
      return;
    }
    setUserData({ ...userData, ...form });
    setEditMode(false);
  };

  // Zod validasi
  const formSchema = z.object({
    full_name: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh huruf dan spasi")
      .min(2, "Nama minimal 2 karakter")
      .min(1, "Nama wajib diisi"),
    phone_number: z
      .string()
      .max(15, "Nomor HP terlalu panjang")
      .regex(/^(\+62|08)[0-9]{7,14}$/, "Gunakan format +62 atau 08")
      .min(8, "Nomor HP tidak valid")
      .min(1, "Nomor Telepon Wajib diisi"),
  });

  return (
    <div className="text-white">
      <div className="flex items-center gap-2">
        <MdOutlinePerson size={28} className="text-white" />
        <span className="text-xl font-bold">Profile</span>
      </div>
      <div className="flex flex-col gap-6 mt-4">
        <div className="bg-[#232323] rounded-2xl flex items-center px-8 py-6 justify-between">
          <div className="flex items-center gap-6">
            <img
              src="/img/Avatar.png"
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <div className="text-3xl font-bold leading-tight">
                {form.full_name}
              </div>
              <div className="text-lg text-gray-300">{form.email}</div>
            </div>
          </div>
          <button
            className="flex items-center gap-2 text-gray-300 hover:text-white text-lg"
            onClick={buttonEdit}
            disabled={editMode}
          >
            edit <FiEdit2 size={20} />
          </button>
        </div>
        <div className="bg-[#232323] rounded-2xl px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Nomor ID</label>
            <input
              className="bg-transparent text-xl font-semibold mb-4 w-full outline-none py-4"
              value={form.id}
              name="id"
              disabled
              readOnly
            />
            <label className="block text-gray-400 text-sm mb-1">
              Nama Lengkap
            </label>
            <input
              className={`text-xl font-semibold mb-4 w-full outline-none rounded-lg transition-all duration-150 py-4
                ${
                  editMode
                    ? "border-none bg-[#2B2B2B] px-2  focus:border focus:border-gray-400 hover:border hover:border-gray-400 cursor-pointer"
                    : "bg-transparent border-none"
                }
              `}
              name="full_name"
              value={form.full_name}
              onChange={onChange}
              disabled={!editMode}
              autoComplete="off"
            />
            {formErrors.full_name && (
              <p className="text-red-400 text-xs mb-2">
                {formErrors.full_name}
              </p>
            )}
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              className="bg-transparent text-xl font-normal mb-4 w-full outline-none text-gray-300 py-4"
              name="email"
              value={form.email}
              disabled
              readOnly
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Nomor HP</label>
            <input
              className={`text-xl font-semibold mb-4 w-full outline-none rounded-lg transition-all duration-150 py-4
                ${
                  editMode
                    ? "border-none bg-[#2B2B2B] px-2  focus:border focus:border-gray-400 hover:border hover:border-gray-400 cursor-pointer"
                    : "bg-transparent border-none"
                }
              `}
              name="phone_number"
              value={form.phone_number}
              onChange={onChange}
              disabled={!editMode}
              autoComplete="off"
            />
            {formErrors.phone_number && (
              <p className="text-red-400 text-xs mb-2">
                {formErrors.phone_number}
              </p>
            )}
            <label className="block text-gray-400 text-sm mb-1">
              Status Keanggotaan
            </label>
            <input
              className="bg-transparent text-2xl font-semibold mb-4 w-full outline-none py-4"
              value={form.membership || "VIP"}
              disabled
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
        {editMode && (
          <div className="flex gap-4 justify-end">
            <button
              className="px-6 py-2 rounded-lg bg-[#4A2075] text-white font-semibold hover:bg-[#3a1760] transition-colors"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Save"}
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
      </div>
      <Modal
        open={showModal}
        title="Batalkan Perubahan?"
        message="Perubahan yang belum disimpan akan hilang."
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
        confirmText="Ya, batalkan"
        cancelText="Lanjut Edit"
      />
    </div>
  );
};

export default ProfilePage;
