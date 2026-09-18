import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Plus,
  Sprout,
  X,
  LocateFixed,
  Eye,
  Pencil,
  Trash2,
  Save,
} from 'lucide-react';
import { useLanguage } from '../i18n';

const SOIL_TYPES = [
  'Loamy',
  'Clay',
  'Sandy',
  'Silty',
  'Peaty',
  'Chalky',
];

const SOIL_TEXTURES = [
  'Fine',
  'Medium',
  'Coarse',
  'Fine-medium',
  'Medium-coarse',
];

const EMPTY_FORM = {
  name: '',
  size: '',
  soilType: '',
  soilTexture: '',
  location: '',
  latitude: '',
  longitude: '',
};

const DEFAULT_FARMS = [
  {
    id: 1,
    name: 'Maduhu Farm',
    size: '2.5',
    soilType: 'Loamy',
    soilTexture: 'Medium',
    location: 'Mbeya, Tanzania',
    latitude: '',
    longitude: '',
  },
  {
    id: 2,
    name: 'Kibena Farm',
    size: '1.8',
    soilType: 'Sandy',
    soilTexture: 'Coarse',
    location: 'Mbeya, Tanzania',
    latitude: '',
    longitude: '',
  },
];

export function Farms() {
  const { t } = useLanguage();

  const [farms, setFarms] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisense_farms');

      return saved ? JSON.parse(saved) : DEFAULT_FARMS;
    } catch {
      return DEFAULT_FARMS;
    }
  });

  const [openForm, setOpenForm] = useState(false);
  const [viewFarm, setViewFarm] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Save farms locally
  useEffect(() => {
    localStorage.setItem(
      'agrisense_farms',
      JSON.stringify(farms)
    );
  }, [farms]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Capture GPS
  const captureGPS = () => {
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError(
        'GPS is not supported by this browser.'
      );
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude.toFixed(6);

        const longitude =
          position.coords.longitude.toFixed(6);

        setForm((current) => ({
          ...current,
          latitude,
          longitude,
          location: `${latitude}, ${longitude}`,
        }));

        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);

        if (error.code === 1) {
          setGpsError(
            'Location permission denied. Please allow location access in your browser.'
          );
        } else if (error.code === 2) {
          setGpsError(
            'Unable to determine your location.'
          );
        } else if (error.code === 3) {
          setGpsError(
            'Location request timed out. Please try again.'
          );
        } else {
          setGpsError(
            'Unable to capture GPS location.'
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Open add form
  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setGpsError('');
    setOpenForm(true);
  };

  // Open edit form
  const openEditForm = (farm) => {
    setEditingId(farm.id);

    setForm({
      name: farm.name || '',
      size: farm.size || '',
      soilType: farm.soilType || '',
      soilTexture: farm.soilTexture || '',
      location: farm.location || '',
      latitude: farm.latitude || '',
      longitude: farm.longitude || '',
    });

    setGpsError('');
    setOpenForm(true);
  };

  // Save / update farm
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.size ||
      !form.soilType ||
      !form.soilTexture
    ) {
      return;
    }

    if (editingId) {
      setFarms((current) =>
        current.map((farm) =>
          farm.id === editingId
            ? {
                ...farm,
                ...form,
              }
            : farm
        )
      );
    } else {
      const newFarm = {
        id: Date.now(),
        ...form,
      };

      setFarms((current) => [
        ...current,
        newFarm,
      ]);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setOpenForm(false);
    setGpsError('');
  };

  // Delete farm
  const deleteFarm = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this farm?'
    );

    if (!confirmed) return;

    setFarms((current) =>
      current.filter((farm) => farm.id !== id)
    );

    if (viewFarm?.id === id) {
      setViewFarm(null);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">
            {t('farmManagement')}
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            {t('farmsTitle')}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {t('registerReview')}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="btn-primary"
        >
          <Plus size={18} />
          {t('addFarm')}
        </button>
      </div>

      {/* FARM CARDS */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {farms.map((farm) => (
          <div
            key={farm.id}
            className="card overflow-hidden"
          >

            {/* FARM IMAGE AREA */}
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-mint to-green-100 dark:from-green-950/40 dark:to-slate-900">
              <Sprout
                size={52}
                className="text-leaf/60"
              />
            </div>

            {/* FARM INFO */}
            <div className="p-5">

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">
                    {farm.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {farm.size} ha
                  </p>
                </div>

                <div className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 dark:bg-green-950 dark:text-green-300">
                  {farm.soilType}
                </div>
              </div>

              {/* SOIL DETAILS */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[11px] text-slate-400">
                    {t('soilType')}
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {farm.soilType}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[11px] text-slate-400">
                    {t('soilTexture')}
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {farm.soilTexture}
                  </p>
                </div>

              </div>

              {/* LOCATION */}
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-leaf"
                />

                <span className="break-all">
                  {farm.location || 'Location not set'}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 grid grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() => setViewFarm(farm)}
                  className="btn-soft flex items-center justify-center gap-1.5 text-sm"
                >
                  <Eye size={15} />
                  {t('view')}
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(farm)}
                  className="btn-soft flex items-center justify-center gap-1.5 text-sm"
                >
                  <Pencil size={15} />
                  {t('edit')}
                </button>

                <button
                  type="button"
                  onClick={() => deleteFarm(farm.id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline">
                    Delete
                  </span>
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {farms.length === 0 && (
        <div className="card mt-8 p-10 text-center">
          <Sprout
            size={45}
            className="mx-auto text-leaf/50"
          />

          <h2 className="mt-4 text-xl font-extrabold">
            No farms registered
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add your first farm to start managing
            your agricultural data.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="btn-primary mx-auto mt-5"
          >
            <Plus size={17} />
            {t('addFarm')}
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {openForm && (
        <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/50 p-4">

          <form
            onSubmit={handleSubmit}
            className="card my-6 w-full max-w-xl p-5 sm:p-7"
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="section-kicker">
                  {t('farmSetup')}
                </p>

                <h2 className="text-2xl font-extrabold">
                  {editingId
                    ? 'Edit Farm'
                    : t('addFarm')}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {/* FARM NAME */}
              <div className="sm:col-span-2">
                <label className="label">
                  {t('farmName')}
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g. Maduhu Farm"
                />
              </div>

              {/* SIZE */}
              <div>
                <label className="label">
                  {t('size')}
                </label>

                <input
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  required
                  type="number"
                  min="0"
                  step="any"
                  className="input"
                  placeholder="e.g. 2.5"
                />
              </div>

              {/* SOIL TYPE */}
              <div>
                <label className="label">
                  {t('soilType')}
                </label>

                <select
                  name="soilType"
                  value={form.soilType}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">
                    Select soil type
                  </option>

                  {SOIL_TYPES.map((soil) => (
                    <option
                      key={soil}
                      value={soil}
                    >
                      {soil}
                    </option>
                  ))}
                </select>
              </div>

              {/* SOIL TEXTURE */}
              <div>
                <label className="label">
                  {t('soilTexture')}
                </label>

                <select
                  name="soilTexture"
                  value={form.soilTexture}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">
                    Select soil texture
                  </option>

                  {SOIL_TEXTURES.map((texture) => (
                    <option
                      key={texture}
                      value={texture}
                    >
                      {texture}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION */}
              <div>
                <label className="label">
                  {t('location')}
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="City / district / ward"
                />
              </div>

            </div>

            {/* GPS */}
            <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-bold">
                    GPS Location
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Capture your current farm coordinates
                  </p>
                </div>

                <button
                  type="button"
                  onClick={captureGPS}
                  disabled={gpsLoading}
                  className="btn-soft shrink-0"
                >
                  <LocateFixed
                    size={17}
                    className={
                      gpsLoading
                        ? 'animate-pulse'
                        : ''
                    }
                  />

                  {gpsLoading
                    ? 'Getting location...'
                    : 'Capture GPS'}
                </button>

              </div>

              {/* GPS RESULT */}
              {form.latitude &&
                form.longitude && (
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-[11px] text-slate-400">
                        Latitude
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {form.latitude}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-[11px] text-slate-400">
                        Longitude
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {form.longitude}
                      </p>
                    </div>

                  </div>
                )}

              {/* GPS ERROR */}
              {gpsError && (
                <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-300">
                  {gpsError}
                </p>
              )}

            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="btn-soft flex-1"
              >
                {t('cancel')}
              </button>

              <button
                type="submit"
                className="btn-primary flex-1"
              >
                <Save size={17} />

                {editingId
                  ? 'Update Farm'
                  : t('saveFarm')}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* VIEW FARM MODAL */}
      {viewFarm && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/50 p-4">

          <div className="card w-full max-w-lg p-6 sm:p-7">

            {/* HEADER */}
            <div className="flex items-center justify-between">

              <div>
                <p className="section-kicker">
                  Farm Details
                </p>

                <h2 className="text-2xl font-extrabold">
                  {viewFarm.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setViewFarm(null)}
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* DETAILS */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">
                  Farm Size
                </p>

                <p className="mt-1 font-bold">
                  {viewFarm.size} ha
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">
                  Soil Type
                </p>

                <p className="mt-1 font-bold">
                  {viewFarm.soilType}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">
                  Soil Texture
                </p>

                <p className="mt-1 font-bold">
                  {viewFarm.soilTexture}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">
                  Location
                </p>

                <p className="mt-1 break-all font-bold">
                  {viewFarm.location ||
                    'Not set'}
                </p>
              </div>

            </div>

            {/* GPS */}
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">

              <div className="flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-leaf"
                />

                <p className="font-bold">
                  GPS Coordinates
                </p>
              </div>

              {viewFarm.latitude &&
              viewFarm.longitude ? (
                <div className="mt-3 grid grid-cols-2 gap-3">

                  <div>
                    <p className="text-xs text-slate-400">
                      Latitude
                    </p>

                    <p className="font-semibold">
                      {viewFarm.latitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Longitude
                    </p>

                    <p className="font-semibold">
                      {viewFarm.longitude}
                    </p>
                  </div>

                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  GPS coordinates have not been captured.
                </p>
              )}

            </div>

            {/* VIEW ACTIONS */}
            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setViewFarm(null);
                  openEditForm(viewFarm);
                }}
                className="btn-soft flex-1"
              >
                <Pencil size={16} />
                {t('edit')}
              </button>

              <button
                type="button"
                onClick={() => setViewFarm(null)}
                className="btn-primary flex-1"
              >
                {t('close') || 'Close'}
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}

