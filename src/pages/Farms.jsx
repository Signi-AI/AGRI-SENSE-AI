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
import './Auth.jsx';

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky'];
const SOIL_TEXTURES = ['Fine', 'Medium', 'Coarse', 'Fine-medium', 'Medium-coarse'];

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
  { id: 1, name: 'Maduhu Farm', size: '2.5', soilType: 'Loamy', soilTexture: 'Medium', location: 'Mbeya, Tanzania', latitude: '', longitude: '' },
  { id: 2, name: 'Kibena Farm', size: '1.8', soilType: 'Sandy', soilTexture: 'Coarse', location: 'Mbeya, Tanzania', latitude: '', longitude: '' },
];

// Shared neumorphic control classes
const FIELD = 'neu-inset neu-pressable h-12 w-full rounded-xl border-0 px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none';
const LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]';
const BTN_PRIMARY = 'neu-raised-sm neu-pressable inline-flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white';
const BTN_SOFT = 'neu-raised-sm neu-pressable inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold text-[color:var(--neu-text)]';

export function Farms() {
  const { t } = useLanguage();
  const { user } = useAuth(); // CHANGED

  // CHANGED: one storage key per user, so accounts never see each other's farms
  const storageKey = `agrisense_farms_${user?.id ?? 'guest'}`;

  const [farms, setFarms] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisense_farms');
      return saved ? JSON.parse(saved) : DEFAULT_FARMS;
    } catch {
      return []; // CHANGED
    }
  });

  const [openForm, setOpenForm] = useState(false);
  const [viewFarm, setViewFarm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    localStorage.setItem('agrisense_farms', JSON.stringify(farms));
  }, [farms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const captureGPS = () => {
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('GPS is not supported by this browser.');
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);

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
          setGpsError('Location permission denied. Please allow location access in your browser.');
        } else if (error.code === 2) {
          setGpsError('Unable to determine your location.');
        } else if (error.code === 3) {
          setGpsError('Location request timed out. Please try again.');
        } else {
          setGpsError('Unable to capture GPS location.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setGpsError('');
    setOpenForm(true);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.size || !form.soilType || !form.soilTexture) {
      return;
    }

    if (editingId) {
      setFarms((current) => current.map((farm) => (farm.id === editingId ? { ...farm, ...form } : farm)));
    } else {
      const newFarm = { id: Date.now(), ...form };
      setFarms((current) => [...current, newFarm]);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setOpenForm(false);
    setGpsError('');
  };

  const deleteFarm = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this farm?');
    if (!confirmed) return;

    setFarms((current) => current.filter((farm) => farm.id !== id));
    if (viewFarm?.id === id) setViewFarm(null);
  };

  return (
    <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('farmManagement')}</p>
          <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">{t('farmsTitle')}</h1>
          <p className="mt-2 text-sm text-[color:var(--neu-muted)]">{t('registerReview')}</p>
        </div>

        <button type="button" onClick={openAddForm} className={BTN_PRIMARY}>
          <Plus size={18} />
          {t('addFarm')}
        </button>
      </div>

      {/* FARM CARDS */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm) => (
          <div key={farm.id} className="neu-raised overflow-hidden rounded-2xl">

            <div className="neu-inset flex h-32 items-center justify-center">
              <Sprout size={52} className="text-[color:var(--neu-accent)]" />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[color:var(--neu-text)]">{farm.name}</h2>
                  <p className="mt-1 text-xs text-[color:var(--neu-muted)]">{farm.size} ha</p>
                </div>

                <div className="neu-inset rounded-full px-2.5 py-1 text-xs font-bold text-[color:var(--neu-accent-dark)]">
                  {farm.soilType}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="neu-inset rounded-xl p-3">
                  <p className="text-[11px] text-[color:var(--neu-muted)]">{t('soilType')}</p>
                  <p className="mt-1 text-sm font-bold text-[color:var(--neu-text)]">{farm.soilType}</p>
                </div>
                <div className="neu-inset rounded-xl p-3">
                  <p className="text-[11px] text-[color:var(--neu-muted)]">{t('soilTexture')}</p>
                  <p className="mt-1 text-sm font-bold text-[color:var(--neu-text)]">{farm.soilTexture}</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-[color:var(--neu-muted)]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[color:var(--neu-accent)]" />
                <span className="break-all">{farm.location || 'Location not set'}</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setViewFarm(farm)} className={`${BTN_SOFT} text-xs sm:text-sm`}>
                  <Eye size={15} />
                  {t('view')}
                </button>

                <button type="button" onClick={() => openEditForm(farm)} className={`${BTN_SOFT} text-xs sm:text-sm`}>
                  <Pencil size={15} />
                  {t('edit')}
                </button>

                <button
                  type="button"
                  onClick={() => deleteFarm(farm.id)}
                  className="neu-raised-sm neu-pressable flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold text-red-500 dark:text-red-300"
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {farms.length === 0 && (
        <div className="neu-raised mt-8 rounded-2xl p-10 text-center">
          <Sprout size={45} className="mx-auto text-[color:var(--neu-accent)]" />
          <h2 className="mt-4 text-xl font-extrabold text-[color:var(--neu-text)]">No farms registered</h2>
          <p className="mt-2 text-sm text-[color:var(--neu-muted)]">
            Add your first farm to start managing your agricultural data.
          </p>
          <button type="button" onClick={openAddForm} className={`${BTN_PRIMARY} mx-auto mt-5`}>
            <Plus size={17} />
            {t('addFarm')}
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {openForm && (
        <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="neu-raised my-6 w-full max-w-xl rounded-2xl p-5 sm:p-7">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('farmSetup')}</p>
                <h2 className="text-2xl font-extrabold text-[color:var(--neu-text)]">{editingId ? 'Edit Farm' : t('addFarm')}</h2>
              </div>

              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="neu-raised-sm neu-pressable grid h-9 w-9 place-items-center rounded-xl text-[color:var(--neu-muted)]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={LABEL}>{t('farmName')}</label>
                <input name="name" value={form.name} onChange={handleChange} required className={FIELD} placeholder="e.g. Maduhu Farm" />
              </div>

              <div>
                <label className={LABEL}>{t('size')}</label>
                <input name="size" value={form.size} onChange={handleChange} required type="number" min="0" step="any" className={FIELD} placeholder="e.g. 2.5" />
              </div>

              <div>
                <label className={LABEL}>{t('soilType')}</label>
                <select name="soilType" value={form.soilType} onChange={handleChange} required className={FIELD}>
                  <option value="">Select soil type</option>
                  {SOIL_TYPES.map((soil) => <option key={soil} value={soil}>{soil}</option>)}
                </select>
              </div>

              <div>
                <label className={LABEL}>{t('soilTexture')}</label>
                <select name="soilTexture" value={form.soilTexture} onChange={handleChange} required className={FIELD}>
                  <option value="">Select soil texture</option>
                  {SOIL_TEXTURES.map((texture) => <option key={texture} value={texture}>{texture}</option>)}
                </select>
              </div>

              <div>
                <label className={LABEL}>{t('location')}</label>
                <input name="location" value={form.location} onChange={handleChange} className={FIELD} placeholder="City / district / ward" />
              </div>
            </div>

            {/* GPS */}
            <div className="neu-inset mt-5 rounded-2xl p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-[color:var(--neu-text)]">GPS Location</p>
                  <p className="mt-1 text-xs text-[color:var(--neu-muted)]">Capture your current farm coordinates</p>
                </div>

                <button type="button" onClick={captureGPS} disabled={gpsLoading} className={`${BTN_SOFT} shrink-0`}>
                  <LocateFixed size={17} className={gpsLoading ? 'animate-pulse' : ''} />
                  {gpsLoading ? 'Getting location...' : 'Capture GPS'}
                </button>
              </div>

              {form.latitude && form.longitude && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="neu-raised-sm rounded-xl p-3">
                    <p className="text-[11px] text-[color:var(--neu-muted)]">Latitude</p>
                    <p className="mt-1 text-sm font-bold text-[color:var(--neu-text)]">{form.latitude}</p>
                  </div>
                  <div className="neu-raised-sm rounded-xl p-3">
                    <p className="text-[11px] text-[color:var(--neu-muted)]">Longitude</p>
                    <p className="mt-1 text-sm font-bold text-[color:var(--neu-text)]">{form.longitude}</p>
                  </div>
                </div>
              )}

              {gpsError && (
                <p role="alert" className="neu-raised-sm mt-3 rounded-xl p-3 text-xs font-medium text-red-500 dark:text-red-300">
                  {gpsError}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setOpenForm(false)} className={`${BTN_SOFT} flex-1`}>
                {t('cancel')}
              </button>

              <button type="submit" className={`${BTN_PRIMARY} flex-1`}>
                <Save size={17} />
                {editingId ? 'Update Farm' : t('saveFarm')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW FARM MODAL */}
      {viewFarm && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/50 p-4">
          <div className="neu-raised w-full max-w-lg rounded-2xl p-6 sm:p-7">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">Farm Details</p>
                <h2 className="text-2xl font-extrabold text-[color:var(--neu-text)]">{viewFarm.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setViewFarm(null)}
                className="neu-raised-sm neu-pressable grid h-9 w-9 place-items-center rounded-xl text-[color:var(--neu-muted)]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="neu-inset rounded-2xl p-4">
                <p className="text-xs text-[color:var(--neu-muted)]">Farm Size</p>
                <p className="mt-1 font-bold text-[color:var(--neu-text)]">{viewFarm.size} ha</p>
              </div>
              <div className="neu-inset rounded-2xl p-4">
                <p className="text-xs text-[color:var(--neu-muted)]">Soil Type</p>
                <p className="mt-1 font-bold text-[color:var(--neu-text)]">{viewFarm.soilType}</p>
              </div>
              <div className="neu-inset rounded-2xl p-4">
                <p className="text-xs text-[color:var(--neu-muted)]">Soil Texture</p>
                <p className="mt-1 font-bold text-[color:var(--neu-text)]">{viewFarm.soilTexture}</p>
              </div>
              <div className="neu-inset rounded-2xl p-4">
                <p className="text-xs text-[color:var(--neu-muted)]">Location</p>
                <p className="mt-1 break-all font-bold text-[color:var(--neu-text)]">{viewFarm.location || 'Not set'}</p>
              </div>
            </div>

            <div className="neu-inset mt-4 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[color:var(--neu-accent)]" />
                <p className="font-bold text-[color:var(--neu-text)]">GPS Coordinates</p>
              </div>

              {viewFarm.latitude && viewFarm.longitude ? (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[color:var(--neu-muted)]">Latitude</p>
                    <p className="font-semibold text-[color:var(--neu-text)]">{viewFarm.latitude}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[color:var(--neu-muted)]">Longitude</p>
                    <p className="font-semibold text-[color:var(--neu-text)]">{viewFarm.longitude}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-[color:var(--neu-muted)]">GPS coordinates have not been captured.</p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setViewFarm(null);
                  openEditForm(viewFarm);
                }}
                className={`${BTN_SOFT} flex-1`}
              >
                <Pencil size={16} />
                {t('edit')}
              </button>

              <button type="button" onClick={() => setViewFarm(null)} className={`${BTN_PRIMARY} flex-1`}>
                {t('close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default Farms;
