use std::ops::{Add, Mul, Sub};

use crate::bitboard::Bitboard;

pub struct Cord(u8);

impl Cord {
    const X_MASK: u8 = 0b00000111;
    const Y_MASK: u8 = 0b00111000;

    #[inline(always)]
    pub fn x(&self) -> u8{
        self.0 & Self::X_MASK
    }

    #[inline(always)]
    pub fn y(&self) -> u8{
        (self.0 & Self::Y_MASK) >> 3
    }

    #[inline(always)]
    pub fn from_xy(x: u8, y: u8) -> Cord{
        debug_assert!(x < 8);
        debug_assert!(y < 8);
        Cord(x + y << 3)
    }
    
    #[inline(always)]
    pub fn inner(&self) -> u8{
        self.0
    }
}

impl<T: Into<Cord>> Add<T> for Cord{
    type Output = Cord;
    fn add(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        Cord::from_xy(self.x() + rhs.x(), self.y() + rhs.y())
    }
}

impl<T: Into<Cord>> Sub<T> for Cord{
    type Output = Cord;
    fn sub(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        Cord::from_xy(self.x() - rhs.x(), self.y() - rhs.y())
    }
}

impl Mul<u8> for Cord {
    type Output = Cord;

    fn mul(self, rhs: u8) -> Self::Output {
        Cord::from_xy(self.x() * rhs, self.y() * rhs)
    }
}

impl Into<Cord> for u8{fn into(self) -> Cord {Cord(self)}}
impl Into<Cord> for (u8, u8){fn into(self) -> Cord {Cord::from_xy(self.0, self.1)}}

macro_rules! c_into_number {
    ($t:ty) => {
        impl Into<$t> for Cord{
            fn into(self) -> $t {
                self.0 as $t
            }
        }
    };
}
c_into_number!(u8);
c_into_number!(u16);
c_into_number!(u32);
c_into_number!(u64);
c_into_number!(usize);

impl Into<Bitboard> for Cord{
    fn into(self) -> Bitboard {
        Bitboard(1 << self.0)
    }
}
impl Into<DeltaCoord> for Cord{
    fn into(self) -> DeltaCoord {
        DeltaCoord(self.0)
    }
}

pub struct DeltaCoord(pub u8);
impl DeltaCoord{
    const X_MASK: u8 = 0b00000111;
    const Y_MASK: u8 = 0b00111000;
    // If flagged - x/y (not 2's compliment)
    const X_SIGN: u8 = 0b01000000;
    const Y_SIGN: u8 = 0b10000000;

    #[inline(always)]
    pub fn x(&self) -> u8{
        debug_assert!(self.0 & Self::X_SIGN == 0);
        self.0 & Self::X_MASK
    }

    #[inline(always)]
    pub fn y(&self) -> u8{
        debug_assert!(self.0 & Self::Y_SIGN == 0);
        (self.0 & Self::Y_MASK) >> 3
    }

    #[inline(always)]
    pub fn dx(&self) -> i8{
        (self.0 & Self::X_MASK) as i8 * (if self.0 & Self::X_SIGN == 0 {1} else {-1})
    }

    #[inline(always)]
    pub fn dy(&self) -> i8{
        (self.0 & Self::Y_MASK) as i8 >> 3 * (if self.0 & Self::Y_SIGN == 0 {1} else {-1})
    }

    #[inline(always)]
    pub fn is_pos(&self) -> bool{
        (self.0 & (Self::X_SIGN | Self::Y_SIGN)) == 0
    }

    #[inline(always)]
    pub fn into_pos(&self) -> Cord{
        debug_assert!(self.is_pos());
        Cord(self.0)
    }

    #[inline(always)]
    pub fn from_xy(x: u8, y: u8) -> DeltaCoord{
        debug_assert!(x < 8);
        debug_assert!(y < 8);
        DeltaCoord(x + y << 3)
    }
    
    #[inline(always)]
    pub fn from_dxdy(dx: i8, dy: i8) -> DeltaCoord{
        debug_assert!(-8 < dx && dx < 8);
        debug_assert!(-8 < dy && dy < 8);
        DeltaCoord(dx.abs() as u8 + dy.abs() as u8 + if dx < 0 {Self::X_SIGN} else {0} + if dy < 0 {Self::Y_SIGN} else {0})
    }
}

impl<T: Into<DeltaCoord>> Add<T> for DeltaCoord{
    type Output = DeltaCoord;
    fn add(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        DeltaCoord::from_dxdy(self.dx() + rhs.dx(), self.dy() + rhs.dy())
    }
}
impl<T: Into<DeltaCoord>> Sub<T> for DeltaCoord{
    type Output = DeltaCoord;
    fn sub(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        DeltaCoord::from_dxdy(self.dx() - rhs.dx(), self.dy() - rhs.dy())
    }
}
impl Mul<u8> for DeltaCoord {
    type Output = DeltaCoord;

    fn mul(self, rhs: u8) -> Self::Output {
        DeltaCoord::from_xy(self.x() * rhs, self.y() * rhs)
    }
}
impl Mul<i8> for DeltaCoord {
    type Output = DeltaCoord;

    fn mul(self, rhs: i8) -> Self::Output {
        DeltaCoord::from_dxdy(self.dx() * rhs, self.dy() * rhs)
    }
}

impl Into<DeltaCoord> for u8{fn into(self) -> DeltaCoord {DeltaCoord(self)}}
impl Into<DeltaCoord> for (u8, u8){fn into(self) -> DeltaCoord {DeltaCoord::from_xy(self.0, self.1)}}
impl Into<DeltaCoord> for (u8, i8){fn into(self) -> DeltaCoord {DeltaCoord::from_dxdy(self.0 as i8, self.1)}}
impl Into<DeltaCoord> for (i8, u8){fn into(self) -> DeltaCoord {DeltaCoord::from_dxdy(self.0, self.1 as i8)}}
impl Into<DeltaCoord> for (i8, i8){fn into(self) -> DeltaCoord {DeltaCoord::from_dxdy(self.0, self.1)}}

macro_rules! dc_into_number {
    ($t:ty) => {
        impl Into<$t> for DeltaCoord{
            fn into(self) -> $t {
                debug_assert!(self.is_pos());
                self.0 as $t
            }
        }
    };
}
dc_into_number!(u8);
dc_into_number!(u16);
dc_into_number!(u32);
dc_into_number!(u64);
dc_into_number!(usize);

impl Into<Bitboard> for DeltaCoord{
    fn into(self) -> Bitboard {
        debug_assert!(self.is_pos());
        Bitboard(1 << self.0)
    }
}